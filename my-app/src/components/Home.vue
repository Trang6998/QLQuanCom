<template>
  <div style="width: 100%">
    <v-layout row wrap class="ma-3 ml-4 mr-5">
        <h3 style="padding: 20px 10px 0px 0px">Thống kê số liệu trong ngày:</h3>
      <v-flex xs3 style="margin-top: -16px">
        <v-datepicker v-model="searchParamsThongKeNgay.ngay" @input="thongKeNgay()" hide-details></v-datepicker>
      </v-flex>
      
      </v-layout>
    <v-layout row wrap class="ma-3">
      
      <v-flex xs4>
        <v-card style="width: 100%; background-color: #4db6ac" class="pa-3">
          <h2 style="text-align: center; color: white">Số mua vào</h2>
          <h2 style="text-align: center; color: white">{{thongTinThongKeTrongNgay.soMua}}</h2>
          <h3 style="text-align: center; color: white">
            <i>({{thongTinThongKeTrongNgay.soMuaTang >= 0 ? 'Tăng ' + thongTinThongKeTrongNgay.soMuaTang : 'Giảm ' + Math.abs(thongTinThongKeTrongNgay.soMuaTang)}} sản phẩm so với hôm qua)</i>
          </h3>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card style="width: 100%; background-color: #4db6ac" class="pa-3">
          <h2 style="text-align: center; color: white">Số bán ra</h2>
          <h2 style="text-align: center; color: white">{{thongTinThongKeTrongNgay.soBan}}</h2>
          <h3 style="text-align: center; color: white">
            <i>({{thongTinThongKeTrongNgay.soBanTang >= 0 ? 'Tăng ' + thongTinThongKeTrongNgay.soBanTang : 'Giảm ' + Math.abs(thongTinThongKeTrongNgay.soBanTang)}} sản phẩm so với hôm qua)</i>
          </h3>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card style="width: 100%; background-color: #4db6ac" class="pa-3">
          <h2 style="text-align: center; color: white">Doanh thu</h2>
          <h2 style="text-align: center; color: white">{{thongTinThongKeTrongNgay.doanhThu}}</h2>
          <h3 style="text-align: center; color: white">
            <i>(Tăng {{thongTinThongKeTrongNgay.doanhThuTang}}% so với hôm qua)</i>
          </h3>
        </v-card>
      </v-flex>   
    </v-layout>
    <v-layout row wrap class="ma-3 mt-5">
      <h3 style="padding: 20px 10px 0px 0px;">Thống kê số liệu trong tháng:</h3>
      <v-flex xs3 style="margin-top: -16px">
        <v-autocomplete
          v-model="searchParamsThongKeTuan.thang"
          :items="dsThang"
          @change="thongKeTuan()"
          hide-details
          label="Chọn tháng"
          class="mr-1 ml-1"
        >
          <template v-slot:selection="data">Tháng {{ data.item }}</template>
          <template v-slot:item="data">Tháng {{ data.item }}</template>
        </v-autocomplete>
      </v-flex>
      <v-flex xs3 style="margin-top: -16px">
        <v-autocomplete
          v-model="searchParamsThongKeTuan.nam"
          :items="dsNam"
          @change="thongKeTuan()"
          label="Chọn năm"
          class="mr-1 ml-1"
        >
          <template v-slot:selection="data">Năm {{ data.item }}</template>
          <template v-slot:item="data">Năm {{ data.item }}</template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
    <GChart
      type="ColumnChart"
      :data="chartData"
      :options="chartOptions"
      style="margin-left: -50px!important; margin-top: -30px!important; background: none"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import ThongKeApi, { ThongKeTuanApiSearchParams , ThongKeNgayApiSearchParams } from '@/apiResources/ThongKeApi';
import { debug } from "util";
export default Vue.extend({
  data() {
    return {
      // chartData: [
      //     ['Week', 'Doanh thu (100.000 VND)', 'Số đơn'],
      // ],
      chartData: [
        ["Year", "Revenues"],
        ["1", 1000],
        ["2", 300],
        ["3", 900],
        ["4", 690],
        ["5", 744],
        ["6", 865],
        ["7", 976],
        ["8", 678],
        ["9", 555],
        ["10", 454],
        ["11", 567],
        ["12", 778],
        ["13", 875],
        ["14", 667],
        ["15", 354],
        ["16", 1230],
        ["17", 567],
        ["18", 1100],
        ["19", 980],
        ["20", 1240],
        ["21", 1130],
        ["22", 1054],
        ["23", 657],
        ["24", 955],
        ["25", 564],
        ["26", 676],
        ["27", 897],
        ["28", 1460],
        ["29", 1500],
        ["30", 1355],
        ["31", 900]
      ],
      chartOptions: {
        width: 1200,
        height: 450,
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017"
        }
      },
      dsTuan: [1, 2, 3, 4, 5],
      dsThang: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dsNam: [] as any,
      searchParamsThongKeTuan: {} as any,
      searchParamsThongKeNgay: {
        ngay: this.$moment().format("YYYY/MM/DD")
      } as any,
      thongTinThongKeTrongNgay: {
        soMua: 0,
        soBan: 0,
        doanhThu: 0,
        soMuaTang: 0,
        soBanTang: 0,
        doanhThuTang: 0
      },
      coSoID: this.$store.state.user.Profile.CoSoID,
      isAdmin: this.$store.state.user.Profile.LoaiTaiKhoanID == 4
    };
  },
  watch: {},
  created() {
    this.dsNam = [] as number[];
    var currentYear = this.$moment().year();
    for (let i = -10; i <= 10; i++) {
      this.dsNam.push(parseInt(currentYear) + i);
    }
    this.searchParamsThongKeNgay.coSoID = this.coSoID;
    this.searchParamsThongKeTuan.coSoID = this.coSoID;
    this.searchParamsThongKeTuan.tuan =
      this.$moment().week() -
      this.$moment()
        .startOf("month")
        .week() +
      1;
    this.searchParamsThongKeTuan.thang = this.$moment().month() + 1;
    this.searchParamsThongKeTuan.nam = currentYear;
    this.thongKeTuan();
    this.thongKeNgay();
  },
  methods: {
    thayDoiCoSo() {
      this.searchParamsThongKeTuan.coSoID = this.searchParamsThongKeNgay.coSoID;

      this.thongKeNgay();
      this.thongKeTuan();
    },
    thongKeTuan() {
      // this.chartData = [
      //     ['Week', 'Doanh thu (100.000 VND)', 'Số đơn'],
      // ]
      // ThongKeApi.thongKeTuan(this.searchParamsThongKeTuan).then(res => {
      //     for (let i = 0; i < res.length; i++) {
      //         var item = [res[i].GiaTri1, res[i].GiaTri2, res[i].GiaTri3];
      //         this.chartData.push(item)
      //     }
      // })
    },
    thongKeNgay() {
      // ThongKeApi.thongKeNgay(this.searchParamsThongKeNgay).then(res => {
      //     this.thongTinThongKeTrongNgay = res
      // })
    }
  }
});
</script>
