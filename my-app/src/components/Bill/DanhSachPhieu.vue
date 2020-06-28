<template>
  <v-col cols="12" class="pa-0">
    <v-card>
      <v-card-text>
        <h2>Danh sách {{type == 0? 'nhập' : 'xuất'}} hàng</h2>
        <v-row>
          <v-col cols="3">
            <v-datepicker
              v-model="searchParamsBill.fromdate"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              label="Từ ngày"
              placeholder="dd/mm/yyyy"
            ></v-datepicker>
          </v-col>
          <v-col cols="3">
            <v-datepicker
              v-model="searchParamsBill.todate"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              label="Đến ngày"
              placeholder="dd/mm/yyyy"
            ></v-datepicker>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="searchParamsBill.frommoney"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              type="number"
              label="Tổng tiền từ"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="searchParamsBill.tomoney"
              @input="getDataFromApi(searchParamsBill)"
              hide-details
              type="number"
              label="Tổng tiền đến"
            ></v-text-field>
          </v-col>
          <v-col cols="12" style="padding-top:0">
            <v-spacer></v-spacer>
            <v-btn @click="showModalThemSua(false, {})" color="primary" style="float: right" small>
              <v-icon small>add</v-icon>Thêm Mới
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- @update:options="getDataFromApi"
                    :options.sync="searchParamsBill"
          :server-items-length="searchParamsBill.totalItems"-->
          <v-col cols="12" class="pt-0">
            <v-data-table
              :headers="tableHeader"
              :items="lstBill"
              :loading="loadingTable"
              class="elevation-1"
            >
              <v-progress-linear height="2" slot="progress" color="blue" indeterminate></v-progress-linear>
              <template v-slot:body>
                <tbody>
                  <tr v-for="(item, index) in lstBill" :key="index">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">{{ item.Datetime | moment('DD/MM/YYYY') }}</td>
                    <td class="text-center">{{ item.TotalMoney }}</td>
                    <td class="text-center">{{ item.Description }}</td>
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
          <v-btn color="red darken-1" @click.native="deleteBill" text>Xác Nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <them-sua-phieu ref="themSuaPhieu" @save="getDataFromApi(searchParamsBill)"></them-sua-phieu>
  </v-col>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
// import BillApi from '@/apiResources/BillApi';
import { Bill } from "@/models/Bill";
import ThemSuaPhieu from "./ThemSuaPhieu.vue";
import { type } from "os";

export default Vue.extend({
  components: {
    ThemSuaPhieu
  },
  data() {
    return {
      dsBill: [] as Bill[],
      tableHeader: [
        { text: "#", value: "no", sortable: false, align: "center" },
        {
          text: "Ngày tháng",
          value: "BillName",
          sortable: false,
          align: "center"
        },
        {
          text: "Tổng tiền",
          sortable: false,
          value: "Total",
          align: "center"
        },
        { text: "Ghi chú", sortable: false, value: "Total", align: "center" },
        { text: "Thao tác", value: "actions", sortable: false, align: "center" }
      ],
      searchParamsBill: {} as any,
      loadingTable: false,
      selectedBill: {} as Bill,
      dialogConfirmDelete: false,
      lstBill: [
        {
          BillId: 1,
          Datetime: "01/06/2020",
          TotalMoney: 1500000,
          Description: "Nhập dư"
        },
        {
          BillId: 2,
          Datetime: "02/06/2020",
          TotalMoney: 1950000,
          Description: "Hàng nhập lỗi "
        },
        {
          BillId: 3,
          Datetime: "03/06/2020",
          TotalMoney: 1700000,
          Description: "Hàng đến muộn"
        },
        {
          BillId: 4,
          Datetime: "04/06/2020",
          TotalMoney: 2500000,
          Description: "Hàng tươi ngon"
        }
      ],
      type: null as any
    };
  },
  created() {},
  watch: {},
  beforeRouteUpdate(to, from, next) {
    if (to.params.type == "import") this.type = 0;
    else this.type = 1;
    next();
  },
  methods: {
    getDataFromApi(searchParamsBill: any): void {
      this.loadingTable = true;
      //BillApi.search().then(res => {
      // this.dsBill = res.Data;
      // this.searchParamsBill.totalItems = res.Pagination.totalItems;
      // this.loadingTable = false;
      //});
    },
    showModalThemSua(isUpdate: boolean, item: any) {
      (this.$refs.themSuaPhieu as any).show(isUpdate, item);
    },
    confirmDelete(chuyenMuc: Bill): void {
      this.selectedBill = chuyenMuc;
      this.dialogConfirmDelete = true;
    },
    deleteBill(): void {
      // BillApi.delete(this.selectedBill.BillId).then(res => {
      //     this.$snotify.success('Xóa thành công!');
      //     this.getDataFromApi(this.searchParamsBill);
      //     this.dialogConfirmDelete = false;
      // }).catch(res => {
      //     this.$snotify.error('Xóa thất bại!');
      // });
    }
  }
});
</script>

