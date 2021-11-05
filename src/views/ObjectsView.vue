<template>
  <page-view>
<!--    <template v-slot:return>Вернуться</template>-->
    <template v-slot:header>Объекты</template>
    <template v-slot:content>
      <div class="content">
        <div class="controls">
          <div style="transition: all .3s;">
            <c-button
              outlined
              :style="`${selectedItems.length !== 1 ? 'opacity: 0; padding: 0; width: 0; margin: 0; z-index: -1' : ''}`"
              @click="() => $router.push('/objects/' + selectedItems[0])"
            >Изменить</c-button>
            <c-button
              outlined
              variant="danger"
              :style="`${selectedItems.length === 0 ? 'opacity: 0; padding: 0; width: 0; margin: 0; z-index: -1' : ''}`"
              @click="() => deleteObjects()"
            >Удалить</c-button>
          </div>
          <search v-model="search" class="search" />
        </div>

        <div class="payload">
          <loading v-if="isLoading"></loading>
          <div v-else>
            <c-table
              :content="filterContent"
              :headers="['Название', 'Статус', 'Тип', 'Зоны', 'Файлы']"
              :selected-items="selectedItems"
              :onClickAction="(_id) => $router.push('/objects/' + _id)"
              @input="(items) => selectedItems = items"
            ></c-table>
          </div>
        </div>
      </div>
    </template>
  </page-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageView from '@/components/layouts/PageView.vue';
import CButton from '@/components/CButton.vue';
import Search from '@/components/Search.vue';
import Loading from '@/components/Loading.vue';
import CTable from '@/components/CTable.vue';
import {
  BaseObject,
  OBJECT_DELETE,
  OBJECTS_FETCH,
  OBJECTS_GET,
} from '@/store/types';

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

  private selectedItems = [] as string[];

  private isLoading = true;

  async created(): Promise<void> {
    try {
      this.objects = await this.$store.dispatch(OBJECTS_FETCH) || [];
    } catch (err) {
      this.objects = [] as BaseObject[];
      this.$notifications.push({
        type: 'warning',
        title: 'Ошибка',
        message: err.message,
      });
    } finally {
      this.isLoading = false;
    }
  }

  public deleteObjects(): void {
    this.selectedItems.forEach(async (_id) => {
      try {
        await this.$store.dispatch(OBJECT_DELETE, _id);

        this.selectedItems = this.selectedItems.filter((item) => _id !== item);
        this.objects = this.$store.getters[OBJECTS_GET];
      } catch (e) {
        this.$notifications.push({
          title: _id,
          message: e.message,
          type: 'warning',
        });
      }
    });
  }

  get filterContent() {
    const result = this.objects.filter((O) => JSON.stringify(O).toLowerCase().indexOf(this.search.toLowerCase()) !== -1);

    return result.map((O) => ({
      name: O.name,
      status: O.status ?? 1,
      type: O.type,
      areas: O.areas.length,
      files: O.files?.length || 0,
      _id: O._id,
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
