<template>
  <v-col cols="12" class="pa-0">
    <v-card>
      <v-card-text>
        <h2>Danh sách sản phẩm</h2>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="searchParamsProduct.keyworlds"
              @input="getDataFromApi(searchParamsProduct)"
              hide-details
              append-icon="search"
              label="Tìm kiếm"
              placeholder="Tìm kiếm theo tên sản phẩm..."
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="showModalThemSua(false, {})"
              color="primary"
              style="margin-top: 30px; float: right"
              small
            >
              <v-icon small>add</v-icon>Thêm Mới
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- @update:options="getDataFromApi"
                    :options.sync="searchParamsProduct"
          :server-items-length="searchParamsProduct.totalItems"-->
          <v-col cols="12" class="pt-0">
            <v-data-table
              :headers="tableHeader"
              :items="lstProduct"
              :loading="loadingTable"
              class="elevation-1"
            >
              <v-progress-linear height="2" slot="progress" color="blue" indeterminate></v-progress-linear>
              <template v-slot:body>
                <tbody>
                  <tr v-for="(item, index) in lstProduct" :key="index">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                        <v-img :src="item.Thumbnail" width="35" height="35" style="margin: 5px auto"></v-img>
                    </td>
                    <td class="text-center">
                      <v-tooltip bottom color="info" z-index="990">
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{item.ProductName}}</span>
                        </template>
                        <span>
                          <ul>
                            <li v-for="(subItem, idx) in item.ProductInfor" :key="idx">
                              <div
                                style="white-space: nowrap; display: inline-flex; padding-bottom: 5px"
                              >
                                <div
                                  style="width: 150px"
                                >{{subItem.WeekDay}} ({{subItem.Weather}} - {{subItem.Temperature}} độ):</div>&emsp;
                                <v-chip small color="green">{{subItem.NumberPurchased}}</v-chip>&emsp;
                                <v-chip small color="orange">{{subItem.NumberSold}}</v-chip>&emsp;
                                <v-chip
                                  small
                                  color="red"
                                >{{subItem.NumberPurchased - subItem.NumberSold}}</v-chip>
                              </div>
                            </li>
                          </ul>
                        </span>
                      </v-tooltip>
                    </td>
                    <td class="text-center">
                      <v-chip small color="green" dark>{{ item.AmountBuyDay }}</v-chip>/
                      <v-chip small color="orange" dark>{{ item.AmountSellDay }}</v-chip>
                    </td>
                    <td class="text-center">
                      <v-chip small color="green" dark>{{ item.AmountBuyWeek }}</v-chip>/
                      <v-chip small color="orange" dark>{{ item.AmountSellWeek }}</v-chip>
                    </td>
                    <td>
                      <v-layout nowrap style="place-content: center">
                        <v-btn text icon small @click="showModalThemSua(true, item)" class="ma-0">
                          <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn
                          text
                          icon
                          small
                          color="red"
                          class="ma-0"
                          @click="confirmDelete(item)"
                        >
                          <v-icon small>delete</v-icon>
                        </v-btn>
                      </v-layout>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogConfirmDelete" max-width="290">
      <v-card>
        <v-card-title class="headline">Xác nhận xóa</v-card-title>
        <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="dialogConfirmDelete=false" text>Hủy</v-btn>
          <v-btn color="red darken-1" @click.native="deleteProduct" text>Xác Nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <them-sua-san-pham ref="themSuaSanPham" @save="getDataFromApi(searchParamsProduct)"></them-sua-san-pham>
  </v-col>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
import ProductApi from "@/apiResources/ProductApi";
import { Product } from "@/models/Product";
import ThemSuaSanPham from "./ThemSuaSanPham.vue";

export default Vue.extend({
  components: {
    ThemSuaSanPham
  },
  data() {
    return {
      dsProduct: [] as Product[],
      tableHeader: [
        { text: "#", value: "no", sortable: false, align: "center" },
        {
          text: "Ảnh đại diện",
          value: "ProductName",
          sortable: false,
          align: "center"
        },
        {
          text: "Tên sản phẩm",
          value: "ProductName",
          sortable: false,
          align: "center"
        },
        {
          text: "Số lượng mua vào/bán ra trong ngày",
          sortable: false,
          value: "AmountBuyDay",
          align: "center"
        },
        {
          text: "Số lượng mua vào/bán ra trong tuần",
          sortable: false,
          value: "statisticbyweek",
          align: "center"
        },
        { text: "Thao tác", value: "actions", sortable: false, align: "center" }
      ],
      searchParamsProduct: {} as any,
      loadingTable: false,
      selectedProduct: {} as Product,
      dialogConfirmDelete: false,
      lstProduct: [
        {
          ProductId: 1,
          ProductName: "Sản phẩm 1",
          Thumbnail: "https://znews-photo.zadn.vn/w660/Uploaded/wyhktpu/2018_08_13/image003_20.jpg",
          AmountBuyDay: 159,
          AmountSellDay: 130,
          AmountBuyWeek: 896,
          AmountSellWeek: 796,
          ProductInfor: [
            {
              WeekDay: "Thứ 2",
              Weather: "Nắng",
              Temperature: "29",
              NumberPurchased: 30,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 3",
              Weather: "Mưa",
              Temperature: "28",
              NumberPurchased: 40,
              NumberSold: 30
            },
            {
              WeekDay: "Thứ 4",
              Weather: "Nắng",
              Temperature: "30",
              NumberPurchased: 27,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 5",
              Weather: "Mây",
              Temperature: "27",
              NumberPurchased: 46,
              NumberSold: 37
            },
            {
              WeekDay: "Thứ 6",
              Weather: "Bão",
              Temperature: "25",
              NumberPurchased: 45,
              NumberSold: 39
            },
            {
              WeekDay: "Thứ 7",
              Weather: "Mưa",
              Temperature: "26",
              NumberPurchased: 24,
              NumberSold: 24
            },
            {
              WeekDay: "Chủ nhật",
              Weather: "Mưa",
              Temperature: "29",
              NumberPurchased: 35,
              NumberSold: 29
            }
          ]
        },
        {
          ProductId: 2,
          ProductName: "Sản phẩm 2",
          Thumbnail: "https://znews-photo.zadn.vn/w660/Uploaded/wyhktpu/2018_08_13/image005_13.jpg",
          AmountBuyDay: 135,
          AmountSellDay: 120,
          AmountBuyWeek: 796,
          AmountSellWeek: 606,
          ProductInfor: [
            {
              WeekDay: "Thứ 2",
              Weather: "Nắng",
              Temperature: "29",
              NumberPurchased: 30,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 3",
              Weather: "Mưa",
              Temperature: "28",
              NumberPurchased: 40,
              NumberSold: 30
            },
            {
              WeekDay: "Thứ 4",
              Weather: "Nắng",
              Temperature: "30",
              NumberPurchased: 27,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 5",
              Weather: "Mây",
              Temperature: "27",
              NumberPurchased: 46,
              NumberSold: 37
            },
            {
              WeekDay: "Thứ 6",
              Weather: "Bão",
              Temperature: "25",
              NumberPurchased: 45,
              NumberSold: 39
            },
            {
              WeekDay: "Thứ 7",
              Weather: "Mưa",
              Temperature: "26",
              NumberPurchased: 24,
              NumberSold: 24
            },
            {
              WeekDay: "Chủ nhật",
              Weather: "Mưa",
              Temperature: "29",
              NumberPurchased: 35,
              NumberSold: 29
            }
          ]
        },
        {
          ProductId: 3,
          ProductName: "Sản phẩm 3",
          Thumbnail: "https://znews-photo.zadn.vn/w660/Uploaded/wyhktpu/2018_08_13/image007_5.jpg",
          AmountBuyDay: 159,
          AmountSellDay: 130,
          AmountBuyWeek: 896,
          AmountSellWeek: 796,
          ProductInfor: [
            {
              WeekDay: "Thứ 2",
              Weather: "Nắng",
              Temperature: "29",
              NumberPurchased: 30,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 3",
              Weather: "Mưa",
              Temperature: "28",
              NumberPurchased: 40,
              NumberSold: 30
            },
            {
              WeekDay: "Thứ 4",
              Weather: "Nắng",
              Temperature: "30",
              NumberPurchased: 27,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 5",
              Weather: "Mây",
              Temperature: "27",
              NumberPurchased: 46,
              NumberSold: 37
            },
            {
              WeekDay: "Thứ 6",
              Weather: "Bão",
              Temperature: "25",
              NumberPurchased: 45,
              NumberSold: 39
            },
            {
              WeekDay: "Thứ 7",
              Weather: "Mưa",
              Temperature: "26",
              NumberPurchased: 24,
              NumberSold: 24
            },
            {
              WeekDay: "Chủ nhật",
              Weather: "Mưa",
              Temperature: "29",
              NumberPurchased: 35,
              NumberSold: 29
            }
          ]
        },
        {
          ProductId: 4,
          ProductName: "Sản phẩm 4",
          Thumbnail: "https://znews-photo.zadn.vn/w660/Uploaded/wyhktpu/2018_08_13/image011_3.jpg",
          AmountBuyDay: 163,
          AmountSellDay: 150,
          AmountBuyWeek: 806,
          AmountSellWeek: 800,
          ProductInfor: [
            {
              WeekDay: "Thứ 2",
              Weather: "Nắng",
              Temperature: "29",
              NumberPurchased: 30,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 3",
              Weather: "Mưa",
              Temperature: "28",
              NumberPurchased: 40,
              NumberSold: 30
            },
            {
              WeekDay: "Thứ 4",
              Weather: "Nắng",
              Temperature: "30",
              NumberPurchased: 27,
              NumberSold: 25
            },
            {
              WeekDay: "Thứ 5",
              Weather: "Mây",
              Temperature: "27",
              NumberPurchased: 46,
              NumberSold: 37
            },
            {
              WeekDay: "Thứ 6",
              Weather: "Bão",
              Temperature: "25",
              NumberPurchased: 45,
              NumberSold: 39
            },
            {
              WeekDay: "Thứ 7",
              Weather: "Mưa",
              Temperature: "26",
              NumberPurchased: 24,
              NumberSold: 24
            },
            {
              WeekDay: "Chủ nhật",
              Weather: "Mưa",
              Temperature: "29",
              NumberPurchased: 35,
              NumberSold: 29
            }
          ]
        }
      ]
    };
  },
  watch: {},
  created() {},
  methods: {
    getDataFromApi(searchParamsProduct: any): void {
      this.loadingTable = true;
      ProductApi.search().then(res => {
        // this.dsProduct = res.Data;
        // this.searchParamsProduct.totalItems = res.Pagination.totalItems;
        // this.loadingTable = false;
      });
    },
    showModalThemSua(isUpdate: boolean, item: any) {
      (this.$refs.themSuaSanPham as any).show(isUpdate, item);
    },
    confirmDelete(chuyenMuc: Product): void {
      this.selectedProduct = chuyenMuc;
      this.dialogConfirmDelete = true;
    },
    deleteProduct(): void {
      ProductApi.delete(this.selectedProduct.ProductId)
        .then(res => {
          this.$snotify.success("Xóa thành công!");
          this.getDataFromApi(this.searchParamsProduct);
          this.dialogConfirmDelete = false;
        })
        .catch(res => {
          this.$snotify.error("Xóa thất bại!");
        });
    }
  }
});
</script>
<style>
.tooltip-background-color {
  color: aliceblue;
}
</style>
