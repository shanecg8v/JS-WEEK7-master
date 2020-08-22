<template>
  <div class="container-fluid">
    <loading :active.sync="isLoading"></loading>
    <h1 class="text-center">圖片儲存列表</h1>
    <table class="table">
      <thead>
        <tr>
          <th>圖片縮圖</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in pictures" :key="item.id">
          <td scope="row">
            <img :src="item.path" class="img-fluid" width="100px">
          </td>
          <td>
            <button type="button" class="btn btn-danger"
             @click="delModal(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :total-pages="pagination.total_pages"
      :current-page="pagination.current_page"
      @emitPages="getPictures" />

    <!-- Del-Modal -->
    <div class="modal fade" id="delModal" tabindex="-1"
     role="dialog" aria-labelledby="delModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger">
            <h5 class="modal-title" id="delModalLabel">刪除照片</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除照片(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger"
             :disabled="isUpdate"
             @click="delPicture">
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
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      pictures: [],
      tempPicturesId: '',
      isLoading: false,
      isUpdate: false,
      pagination: {},
    };
  },
  methods: {
    getPictures() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/admin/storage`;
      this.axios.get(url).then((res) => {
        this.pictures = res.data.data;
        this.pagination = res.data.meta.pagination;
        this.isLoading = false;
      });
    },
    delModal(id) {
      this.tempPicturesId = id;
      $('#delModal').modal('show');
    },
    delPicture() {
      this.isUpdate = true;
      const url = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/admin/storage/${this.tempPicturesId}`;

      this.axios.delete(url).then(() => {
        this.isUpdate = false;
        $('#delModal').modal('hide');
        this.getPictures();
      });
    },
  },
  created() {
    this.getPictures();
  },
};
</script>
