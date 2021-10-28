<template>
  <page-view>
<!--    <template v-slot:return>Вернуться</template>-->
    <template v-slot:header>Объекты</template>
    <template v-slot:content>
      <div>
        <div class="controls">
          <c-button outlined>Изменить</c-button>
          <c-button outlined variant="danger">Удалить</c-button>
          <search v-model="search" class="search" />
        </div>
      </div>
    </template>
  </page-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { watch } from 'vue';
import PageView from '@/components/layouts/PageView.vue';
import CButton from '@/components/CButton.vue';
import Search from '@/components/Search.vue';

@Options({
  components: { Search, PageView, CButton },
})
export default class ObjectsView extends Vue {
  private search = '';

  created() {
    watch(() => this.search, (val) => {
      console.log(val);
    });
  }
}
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  flex-direction: row;

  button {
    width: 116px;
    margin-right: 16px;
  }

  .search {
    margin-left: auto;
  }
}
</style>
