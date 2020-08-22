<template>
  <div class="container">
    <loading :active.sync="isLoading"></loading>
    <h1 class="text-center">優惠卷管理</h1>
    <div class="d-flex justify-content-end my-2">
      <button type="button"
        @click="openModal('new')"
        class="btn btn-primary">
        建立新的優惠卷</button>
    </div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">優惠卷名稱</th>
          <th scope="col">折扣百分比</th>
          <th scope="col">到期日</th>
          <th scope="col">是否開放</th>
          <th scope="col">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td scope="row">{{item.title}}</td>
          <td>{{item.percent}}</td>
          <td>{{item.deadline.datetime}}</td>
          <td v-if="item.enabled" class="text-success">啟用</td>
          <td v-else>未啟用</td>
          <td>
            <button type="button"
             class="btn btn-outline-primary mr-2"
             @click="openModal('edit', item)"
             >編輯</button>
             <button type="button"
             class="btn btn-outline-danger"
             @click="openModal('delete', item)"
             >刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="CouponModal"
      tabindex="-1" role="dialog"
      aria-labelledby="CouponModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="CouponModalLabel"></h5>
            <button type="button" class="close"
              data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="form-group">
                <label for="title">名稱</label>
                <input type="text" class="form-control"
                 id="title" placeholder="請輸入名稱"
                 v-model="tempCoupon.title">
              </div>
              <div class="form-group">
                <label for="code">序號</label>
                <input type="text" class="form-control"
                 id="code" placeholder="請輸入序號"
                 v-model="tempCoupon.code">
              </div>
              <div class="form-group">
                <label for="percent">折扣百分比</label>
                <input type="number" class="form-control"
                 id="percent" placeholder="請輸入折扣百分比"
                 max="100" min="0"
                 v-model="tempCoupon.percent">
              </div>
              <div class="form-group">
                <label for="deadline_date">到期日</label>
                <input type="date" class="form-control"
                 id="deadline_date"
                 v-model="deadline_date">
              </div>
              <div class="form-group">
                <label for="deadline_time">到期時間</label>
                <input type="time" class="form-control"
                 id="deadline_time"
                 step="1"
                 v-model="deadline_time">
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input"
                  id="enabled" v-model="tempCoupon.enabled">
                  <label class="form-check-label" for="enabled">是否開放</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary"
              :disabled="isUpdate"
             @click="updateCoupon">
            <span class="spinner-grow spinner-grow-sm"
             v-if="isUpdate"
             role="status" aria-hidden="true"></span>
            確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Del-Modal -->
    <div class="modal fade" id="delModal" tabindex="-1"
     role="dialog" aria-labelledby="delModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger">
            <h5 class="modal-title" id="delModalLabel">刪除優惠卷</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <span class="text-danger font-weight-bold">{{tempCoupon.title}}</span>
             商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger"
             :disabled="isUpdate"
             @click="delCoupon">
             <span class="spinner-grow spinner-grow-sm"
             v-if="isUpdate"
             role="status" aria-hidden="true"></span>
             刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {
        deadline_at: '',
        enabled: false,
      },
      deadline_date: '',
      deadline_time: '',
      state: '',
      isLoading: false,
      isUpdate: false,
    };
  },
  methods: {
    getCoupons() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/admin/ec/coupons`;

      this.axios.get(url).then((res) => {
        this.isLoading = false;
        this.coupons = res.data.data;
      });
    },
    openModal(action, item) {
      this.state = action;
      switch (action) {
        case 'new':
          this.tempCoupon = {
            deadline_at: '',
            enabled: false,
          };
          this.deadline_date = '';
          this.deadline_time = '';
          $('#CouponModal').on('show.bs.modal', () => {
            $('#CouponModalLabel').text('新增優惠卷');
          }).modal('show');
          break;
        case 'edit': {
          this.tempCoupon = { ...item };
          const deadline = this.tempCoupon.deadline.datetime.split(' ');
          [this.deadline_date, this.deadline_time] = deadline;

          $('#CouponModal').on('show.bs.modal', () => {
            $('#CouponModalLabel').text('編輯優惠卷');
          }).modal('show');
          break;
        }
        case 'delete':
          this.tempCoupon = { ...item };
          $('#delModal').modal('show');
          break;
        default:
          break;
      }
    },
    updateCoupon() {
      this.isUpdate = true;
      let url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/`;
      let method = '';
      this.tempCoupon.deadline_at = `${this.deadline_date} ${this.deadline_time}`;

      switch (this.state) {
        case 'new':
          url += 'admin/ec/coupon';
          method = 'post';
          break;
        case 'edit':
          url += `admin/ec/coupon/${this.tempCoupon.id}`;
          method = 'patch';
          break;
        default:
          break;
      }
      this.axios[method](url, this.tempCoupon).then(() => {
        this.isUpdate = false;
        $('#CouponModal').modal('hide');
        this.getCoupons();
      });
    },
    delCoupon() {
      this.isUpdate = true;
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`;
      this.axios.delete(url).then(() => {
        this.isUpdate = false;
        $('#delModal').modal('hide');
        this.getCoupons();
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
