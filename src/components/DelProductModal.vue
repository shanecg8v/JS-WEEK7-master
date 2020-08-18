<template>
  <div class="modal fade" id="delProductModal" tabindex="-1"
    role="dialog" aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered " role="document">
      <div class="modal-content">
        <div class="modal-header  bg-danger text-white">
          <h5 class="modal-title" id="delProductModalLabel">刪除產品</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          是否刪除 <span class="text-danger font-weight-bold">{{tempProduct.title}}</span> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="delProduct"
            :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
             aria-hidden="true"></span>
             確認</button>
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
      isLoading: false,
    };
  },
  props: ['tempProduct'],
  methods: {
    delProduct() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`;

      this.axios.delete(api).then(() => {
        this.isLoading = false;
        $('#delProductModal').modal('hide');
        this.$emit('update');
      }).catch((error) => {
        this.isLoading = false;
        console.log(error);
      });
    },
  },
};
</script>
