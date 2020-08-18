<template>
  <div class="container">
    <loading :active.sync="isLoading"></loading>
    <h1 class="text-center">產品管控</h1>
    <div class="d-flex justify-content-end my-2">
        <button type="button" class="btn btn-primary"
          @click="openModal('new')">建立新的產品</button>
    </div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col" width="8%">分類</th>
          <th scope="col" width="21%">產品名稱</th>
          <th scope="col" width="8%">原價</th>
          <th scope="col" width="8%">售價</th>
          <th scope="col" width="10%">是否啟用</th>
          <th scope="col" width="20%">編輯</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id"
           :class="[item.enabled ? 'table-success' : 'table-secondary']">
          <td scope="row">{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price}}</td>
          <td class="text-right">{{item.price}}</td>
          <td v-if="item.enabled" class="text-success">啟用</td>
          <td v-else>未啟用</td>
          <td>
            <button class="btn btn-outline-primary mr-2"
              @click="openModal('edit', item)">
              編輯</button>
            <button class="btn btn-outline-danger"
              @click="openModal('delete', item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :total-pages="pagination.total_pages"
      :current-page="pagination.current_page"
      @emitPages="getProducts" />

    <!-- 新增與編輯產品Modal -->
    <ProductModal ref="productModal" :is-new="isNew"
      @update="getProducts" />

    <!-- 刪除產品Modal -->
    <del-product-modal :temp-product="tempProduct" @update="getProducts" />

  </div>
</template>

<script>
/* global $ */
import Pagination from '@/components/Pagination.vue';
import ProductModal from '@/components/ProductModal.vue';
import DelProductModal from '@/components/DelProductModal.vue';

export default {
  components: {
    Pagination,
    ProductModal,
    DelProductModal,
  },
  data() {
    return {
      isLoading: false,
      tempProduct: {
        imageUrl: [],
      },
      isNew: false,
      products: [],
      pagination: {},
      token: '',
    };
  },
  methods: {
    openModal(action, item) {
      switch (action) {
        case 'new':
          this.$refs.productModal.tempProduct = {
            imageUrl: [],
          };
          this.isNew = true;
          $('#productModal').on('show.bs.modal', () => {
            $('#productModalLabel').text('新增產品');
          }).modal('show');
          break;
        case 'edit':
          this.tempProduct = { ...item };
          this.$refs.productModal.getProduct(this.tempProduct.id);
          this.isNew = false;
          break;
        case 'delete':
          this.tempProduct = { ...item };
          $('#delProductModal').modal('show');
          break;
        case 'option':
          this.tempProduct = { ...item };
          this.$refs.appraisalModal.getProduct(this.tempProduct.id);
          break;
        default:
          break;
      }
    },
    getProducts(num = 1) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}${process.env.VUE_APP_UUID}/admin/ec/products?page=${num}`;
      this.axios.get(api).then((res) => {
        this.isLoading = false;
        this.products = res.data.data;
        this.pagination = res.data.meta.pagination;
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

<style>

</style>
