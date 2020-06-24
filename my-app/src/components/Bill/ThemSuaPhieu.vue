<template>
  <v-dialog v-model="isShow" width="800" scrollable persistent>
    <v-card>
      <v-card-title class="primary white--text py-1 px-3">
        <span class="title">{{ isUpdate? 'Cập nhập phiếu' : 'Thêm mới phiếu' }}</span>
        <v-spacer></v-spacer>
        <v-btn class="white--text ma-0" small icon @click="hide">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" scope="frmAddEdit">
          <v-container class="py-0">
            <v-row>
              <v-col cols="6" class="py-0 px-1">
                <v-datepicker
                  v-model="bill.Datetime"
                  label="Ngày xuất phiếu"
                  :error-messages="errors.collect('Ngày xuất phiếu', 'frmAddEdit')"
                  v-validate="'required'"
                  data-vv-scope="frmAddEdit"
                  data-vv-name="Ngày xuất phiếu"
                ></v-datepicker>
              </v-col>
              <v-col cols="6" class="py-0 px-1">
                <v-text-field
                  v-model="bill.TotalMoney"
                  label="Tổng tiền"
                  :error-messages="errors.collect('Tổng tiền', 'frmAddEdit')"
                  v-validate="''"
                  :readonly="true"
                  data-vv-scope="frmAddEdit"
                  data-vv-name="Tổng tiền"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0 px-1">
                <v-text-field
                  v-model="bill.Description"
                  label="Ghi chú" hide-details
                  :error-messages="errors.collect('Ghi chú', 'frmAddEdit')"
                  v-validate="''"
                  data-vv-scope="frmAddEdit"
                  data-vv-name="Ghi chú"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-show="hien">
              <v-col cols="6" class="py-0 px-1 pt-7 pb-3">
                              <h3>Danh sách sản phẩm</h3>
              </v-col>

              <v-col cols="6" class="py-0 px-1 pt-5 pb-3">
                                <v-spacer></v-spacer>

                <v-btn
                  color="orange lighten-2"
                  style="float: right"
                  fab
                  dark
                  small
                  @click="reload()"
                >
                  <v-icon small class="px-0">autorenew</v-icon>
                </v-btn>
                <v-btn
                  color="orange lighten-2"
                  style="float: right; margin-right: 5px"
                  fab
                  dark
                  small
                  @click="saveBillBillDetail()"
                >
                  <v-icon small class="px-0">{{isUpdateChiTiet == false ? 'add' :'save'}}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-show="hien">
              <v-col cols="4" class="py-0 px-1">
                <v-autocomplete
                  v-model="billDetail.BillId"
                  :items="dsProduct"
                  item-text="ProductName"
                  item-value="ProductId"
                  label="Chọn sản phẩm"
                  :error-messages="errors.collect('Chọn sản phẩm', 'formBillDetail')"
                  v-validate="'required'"
                  data-vv-scope="formBillDetail"
                  data-vv-name="Chọn sản phẩm"
                ></v-autocomplete>
              </v-col>
              <v-col cols="2" class="px-1 py-0">
                <v-text-field
                  v-model.number="billDetail.Amount"
                  label="Số lượng"
                  type="number"
                  :error-messages="errors.collect('Số lượng', 'formBillDetail')"
                  v-validate="'required|numeric'"
                  data-vv-scope="formBillDetail"
                  data-vv-name="Số lượng"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="px-1 py-0">
                <v-text-field
                  v-model.number="billDetail.Price"
                  label="Đơn giá"
                  type="number"
                  :error-messages="errors.collect('Đơn giá', 'formBillDetail')"
                  v-validate="'required|numeric'"
                  data-vv-scope="formBillDetail"
                  data-vv-name="Đơn giá"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="px-1 py-0">
                <v-autocomplete
                  v-model="billDetail.BillId"
                  :items="dsWeather"
                  item-text="WeatherName"
                  item-value="WeatherId"
                  label="Thời tiết" 
                ></v-autocomplete>
              </v-col>
              <v-col cols="2" class="px-1 py-0">
                <v-text-field
                  v-model.number="billDetail.Price"
                  label="Nhiệt độ"
                  type="number"
                  :error-messages="errors.collect('Nhiệt độ', 'formBillDetail')"
                  v-validate="'required|numeric'"
                  data-vv-scope="formBillDetail"
                  data-vv-name="Nhiệt độ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" md="12" class="pt-2 py-0 px-1">
                <v-data-table
                  v-show="hien"
                  :loading="loading"
                  :items="dsBillDetail"
                  :headers="tableHeader"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:body>
                    <tbody>
                      <tr
                        v-for="item in dsBillDetail"
                        :key="item.id"
                        @click="selectedRow(item)"
                        style="cursor: pointer"
                      >
                        <td class="text-center">{{item.Product.ProductName}}</td>
                        <td class="text-center">{{item.Amount}}</td>
                        <td class="text-center">{{item.Price}}</td>
                        <td class="text-center">{{item.Amount * item.Price}}</td>
                        <td class="text-center">
                          <v-btn icon small class="mx-0" @click="confirmDelete(props.item)">
                            <v-icon small color="red">delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="hide">Hủy</v-btn>
        <v-btn text @click.native="save" color="primary" :loading="loading" :disabled="loading">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
// import BillApi, { BillApiSearchParams } from '@/apiResources/BillApi';
import { Bill } from "@/models/Bill";
import { BillDetail } from "@/models/BillDetail";
import APIS from "@/apisServer";

export default Vue.extend({
  $_veeValidate: {
    validator: "new"
  },
  components: {},
  data() {
    return {
      valid: false,
      isShow: false,
      isUpdate: false,
      bill: {} as Bill,
      loading: false,
      loadingSave: false,
      active: [] as any[],
      billID: 0,
      isUpdateChiTiet: false,
      dialogConfirmDelete: false,
      hien: false,
      billDetail: {} as BillDetail,
      dsBillDetail: [] as BillDetail[],
      loadingbtn: false,
      tableHeader: [
        { text: "Tên sản phẩm", value: "mon", align: "center", sortable: true },
        { text: "Số lượng", value: "soThuTu", align: "center", sortable: true },
        { text: "Đơn giá", value: "thaotac", align: "center", sortable: true },
        {
          text: "Thành tiền",
          value: "thaotac",
          align: "center",
          sortable: true
        },
        { text: "Thao tác", value: "thaotac", align: "center", sortable: true }
      ],
      dsProduct: [
        {
          ProductId: 1,
          ProductName: "Sản phẩm 1",
          AmountBuyDay: 159,
          AmountSellDay: 130,
          AmountBuyWeek: 896,
          AmountSellWeek: 796
        },
        {
          ProductId: 2,
          ProductName: "Sản phẩm 2",
          AmountBuyDay: 135,
          AmountSellDay: 120,
          AmountBuyWeek: 796,
          AmountSellWeek: 606
        },
        {
          ProductId: 3,
          ProductName: "Sản phẩm 3",
          AmountBuyDay: 159,
          AmountSellDay: 130,
          AmountBuyWeek: 896,
          AmountSellWeek: 796
        },
        {
          ProductId: 4,
          ProductName: "Sản phẩm 4",
          AmountBuyDay: 163,
          AmountSellDay: 150,
          AmountBuyWeek: 806,
          AmountSellWeek: 800
        }
      ],
      dsWeather: [
        { WeatherId: 1, WeatherName: 'Nắng' },
        { WeatherId: 2, WeatherName: 'Mưa' },
        { WeatherId: 3, WeatherName: 'Bão' },
        { WeatherId: 4, WeatherName: 'Mây' },
      ]
    };
  },
  watch: {},
  created() {},
  methods: {
    hide() {
      this.isShow = false;
    },
    show(isUpdate: boolean, item: any) {
      this.$validator.errors.clear();
      this.$validator.reset();
      this.loadingSave = false;
      this.isShow = true;
      this.dsBillDetail = [] as BillDetail[];
      this.billDetail = {} as BillDetail;
      this.getDSBillBillDetail();
      this.getDSBillDetail();
      this.isUpdate = isUpdate;
      if (isUpdate) {
        this.hien = true;
        this.billID = item.BillID;
        this.getDataFromApi(this.billID);
      } else {
        this.hien = false;
        this.bill = {} as Bill;
      }
    },
    getDSBillDetail() {
      // BillDetailApi.search(this.searchParamsBillDetail).then(res => {
      //     this.dsBillDetail = res.Data
      // })
    },
    getDSBillBillDetail(): void {
      // this.searchParamsBill_BillDetail.billID = this.bill.BillID;
      // Bill_BillDetailApi.search(this.searchParamsBill_BillDetail).then(res => {
      //     this.dsBillBillDetail = res.Data;
      // }).catch(res => {
      //     this.loading = false;
      //     this.$snotify.error('Lấy dữ liệu bài hát thất bại!');
      // });
    },

    reload() {
      // this.isUpdateChiTiet = false;
      // this.$validator.reset();
      // this.billDetail = {} as BillDetail;
    },
    selectedRow(value: any) {
      this.billDetail = value;
      this.isUpdateChiTiet = true;
    },
    saveBillBillDetail(): void {
      this.billDetail.BillId = this.bill.BillId;
      this.$validator.validateAll("formBillBillDetail").then(res => {
        if (res) {
          // if (this.isUpdateChiTiet) {
          //     this.loading = true;
          //     BillDetailApi.update(this.billDetail.BillID, this.billDetail.BillDetailID, this.billDetail).then(res => {
          //         this.loading = false;
          //         this.isUpdateChiTiet = false;
          //         this.$emit("save");
          //         this.billDetail = {} as Bill_BillDetail;
          //         this.getDSBillBillDetail();
          //         this.$snotify.success('Cập nhật thành công!');
          //     }).catch(res => {
          //         this.loading = false;
          //         this.$snotify.error('Cập nhật thất bại!');
          //     });
          // } else {
          //     this.loading = true;
          //     Bill_BillDetailApi.insert(this.billDetail).then(res => {
          //         this.billDetail = res;
          //         this.isUpdateChiTiet = false;
          //         this.loading = false;
          //         this.hien = true;
          //         this.$emit("save");
          //         this.billDetail = {} as Bill_BillDetail;
          //         this.getDSBillBillDetail();
          //         this.$snotify.success('Thêm mới thành công!');
          //     }).catch(res => {
          //         this.loading = false;
          //         this.$snotify.error('Bài hát đã tồn tại trong bill!');
          //     });
          // }
        }
      });
    },
    getDataFromApi(id: number): void {
      // BillApi.get(id).then(res => {
      //     this.bill = res;
      // });
    },
    save(): void {
      this.$validator.validateAll("frmAddEdit").then(res => {
        if (res) {
          // if (this.isUpdate) {
          //     this.loading = true;
          //     BillApi.update(this.billID, this.bill).then(res => {
          //         this.loading = false;
          //         this.$emit("save");
          //         this.isShow = false;
          //         this.$snotify.success('Cập nhật thành công!');
          //     }).catch(res => {
          //         this.loading = false;
          //         this.$snotify.error('Cập nhật thất bại!');
          //     });
          // } else {
          //     this.loading = true;
          //     BillApi.insert(this.bill).then(res => {
          //         this.bill = res;
          //         this.isShow = false;
          //         this.$emit("save");
          //         this.loading = false;
          //         this.$snotify.success('Thêm mới thành công!');
          //     }).catch(res => {
          //         this.loading = false;
          //         this.$snotify.error('Thêm mới thất bại!');
          //     });
          // }
        }
      });
    }
  }
});
</script>
<style>
.v-input--selection-controls {
  margin-top: 0px !important;
}

.v-dialog > .v-card > .v-card__subtitle,
.v-dialog > .v-card > .v-card__text {
  padding: 5px 15px;
}

.v-dialog > .v-card > .v-card__title {
  padding: 16px 15px 10px;
}
</style>