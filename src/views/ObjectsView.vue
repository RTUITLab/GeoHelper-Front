<template>
  <page-view>
<!--    <template v-slot:return>Вернуться</template>-->
    <template v-slot:header>Объекты</template>
    <template v-slot:content>
      <div class="content">
        <div class="controls">
          <div>
            <c-button outlined>Изменить</c-button>
            <c-button outlined variant="danger">Удалить</c-button>
          </div>
          <search v-model="search" class="search" />
        </div>

        <div class="payload">
          <loading v-if="isLoading"></loading>
          <div v-else>
            <c-table :content="filterContent" :headers="['Название', 'Статус', 'Тип', 'Зоны', 'Файлы']"></c-table>
          </div>
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
import Loading from '@/components/Loading.vue';
import CTable from '@/components/CTable.vue';
import { BaseObject, OBJECTS_FETCH } from '@/store/types';

@Options({
  components: {
    Search,
    PageView,
    CButton,
    Loading,
    CTable,
  },
})
export default class ObjectsView extends Vue {
  private search = '';

  private objects: BaseObject[] = [];

  private isLoading = true;

  async created(): Promise<void> {
    this.objects = await this.$store.dispatch(OBJECTS_FETCH);
    this.isLoading = false;
  }

  get filterContent() {
    const result = this.objects.filter((O) => JSON.stringify(O).toLowerCase().indexOf(this.search.toLowerCase()) !== -1);

    return result.map((O) => ({
      name: O.name,
      status: O.status,
      type: O.type,
      areas: O.areas.length,
      files: O.files?.length || 0,
    }));
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/mixins';

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  flex-direction: column-reverse;

  > div {
    display: flex;
    width: max-content;
  }

  @include desktop {
    flex-direction: row;

    .search {
      margin-left: auto !important;
      margin-bottom: 0 !important;
      max-width: 300px !important;
    }
  }

  button {
    width: 116px;
    margin-right: 16px;
  }

  .search {
    margin-left: 0;
    margin-bottom: 16px;
    width: 100%;
    max-width: none;
  }
}

.payload {
  flex: 1 1;
  margin-top: 24px;
  padding: 16px;
  border-radius: 4px;
  background-color: var(--white);
  box-shadow: 2px 1px 4px 0 #70727D19;
}
</style>
