<template lang="html">
  <div class="c-table">
    <template v-if="!content.length">
      <div style="font-size: 14px; text-align: center; color: var(--grafit)">Нет данных для отображения</div>
    </template>
    <template v-else>
      <div class="table-first-col">
        <table>
          <thead>
            <tr>
              <th style="width: 32px"></th>
              <th
                @click="() => changeSort(fields[0])"
                :class="filterField === fields[0] ? 'sort' : ''"
                style="width: 300px"
              >{{ headers[0] }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in filteredContent" :key="index">
              <td style="width: 32px; cursor: default">
                <checkbox :title="''" style="margin: 0" @input="() => changeSelection(row._id)"></checkbox>
              </td>
              <td style="width: 300px">{{ row[fields[0]] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-next-cols">
        <table>
          <thead>
            <tr>
              <th
                v-for="(header, i) in headers.slice(1, headers.length)"
                :key="header" @click="() => changeSort(fields[i + 1])"
                :class="filterField === fields[i + 1] ? 'sort' : ''"
              >{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in filteredContent" :key="index">
              <td v-for="(header, i) in headers.slice(1, headers.length)" :key="header">
                <template v-if="fields[i + 1] !== 'status'">{{ row[fields[i + 1]] || '—' }}</template>
                <template v-else>
                  <div class="ring-container">
                    <div class="ringring" :style="!row[fields[i + 1]] ? 'display: none;' : ''"></div>
                    <div class="circle" :style="!!row[fields[i + 1]] ? 'background: var(--deep-blue);' : ''"></div>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <div v-if="content.length" class="pagination not-selectable">
      <back-arrow color="var(--black)" @click="() => page = page === 1 ? page : page - 1"></back-arrow>
      <div
        v-for="(n, i) in pages"
        :key="n"
        :style="`color: var(--${i + 1 === page ? 'deep-blue' : 'black'})`"
        @click="() => page = i + 1"
      >
        {{ i + 1 }}
      </div>
      <next-arrow color="var(--black)" @click="() => page = page === pages.length ? page : page + 1"></next-arrow>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NextArrow from '@/assets/svg/NextArrow.vue';
import BackArrow from '@/assets/svg/BackArrow.vue';
import Checkbox from '@/components/inputs/Checkbox.vue';

@Options({
  props: {
    headers: Array,
    content: Array,
  },
  components: {
    NextArrow,
    BackArrow,
    Checkbox,
  },
  emits: ['input'],
})
export default class CTable extends Vue {
  private page = 1;

  private fields = [] as string[];

  private filterField: null | string = null;

  private ascending = true;

  private selectedItems = [] as string[];

  created() {
    // @ts-ignore
    if (this.content.length) {
      // @ts-ignore
      this.fields = Object.keys(this.content[0]);
    }

    // @ts-ignore
    console.log(this.content);
  }

  public changeSort(field: string): void {
    if (this.filterField === field) {
      if (this.ascending) {
        this.ascending = false;
      } else {
        this.filterField = null;
        this.ascending = true;
      }
    } else {
      this.filterField = field;
      this.ascending = true;
    }
  }

  public changeSelection(_id: string): void {
    if (this.selectedItems.find((item) => item === _id)) {
      this.selectedItems = this.selectedItems.filter((item) => item !== _id);
    } else {
      this.selectedItems.push(_id);
    }

    this.$emit('input', this.selectedItems);
  }

  get filteredContent() {
    // @ts-ignore
    let filtered = JSON.parse(JSON.stringify(this.content));

    if (this.filterField !== null) {
      if (this.ascending) {
        filtered = filtered.sort((itemA: any, itemB: any) => (itemA[this.filterField!] >= itemB[this.filterField!] ? 1 : -1));
      } else {
        filtered = filtered.sort((itemA: any, itemB: any) => (itemA[this.filterField!] < itemB[this.filterField!] ? 1 : -1));
      }
    }

    return filtered.slice((this.page - 1) * 15, this.page * 15);
  }

  get pages(): number[] {
    // @ts-ignore
    const size = this.content.length;
    return new Array<number>(Math.ceil(size / 15));
  }
}
</script>

<style lang="scss">
.c-table {
  position: relative;

  table {
    table-layout: fixed;
    border-collapse: collapse;

    thead tr {
      border-bottom: .1px solid #d2cbcb !important;
      background-color: var(--cloudy_light);
      user-select: none;
    }

    tbody {
      cursor: pointer;
    }
  }
}

.table-first-col {
  position: absolute;
  width: 332px;
  top: 0;
  left: 0;

  background: var(--white);

  z-index: 1000;

  transition: .3s all;

  @media (max-width: 1216px) {
    box-shadow: 8px 0 10px 0 rgb(0 0 0 / 5%);
  }

  * {
    width: 332px;
  }

  td {
    &:last-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
      box-sizing: border-box;
    }
  }
}

.table-next-cols {
  padding-left: 332px;
  overflow: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(43, 45, 57, 0.09);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(43, 45, 57, 0.22);
    border-radius: 6px;
  }

  table {
    width: 100%;
    min-width: 600px;
  }
}

tr {
  border: none;
  border-bottom: .1px solid #d2cbcb;
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }

  th, td {
    padding: 16px 10px;
    border: none;
    box-sizing: border-box;
  }

  th {
    text-transform: uppercase;
    text-align: start;
    font-size: 14px;
    cursor: pointer;

    transition: .3s background-color;
    will-change: background-color;

    &.sort {
      background-color: var(--cloudy_dark);
    }

    &:hover {
      background-color: var(--white);
    }
  }
}

@media (max-width: 525px) {
  .table-next-cols {
    display: none;
  }

  .table-first-col {
    position: relative;
    width: 100%;
    box-shadow: none;

    * {
      width: 100%;
    }
  }
}

.pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  > * {
    padding: 4px 12px;
    cursor: pointer;

    transition: .3s color;
    will-change: color;

    &:hover {
      color: var(--deep-blue) !important;
    }
  }
}

//Pulsating ring
.ring-container {
  position: relative;
  width: 12px;
  height: 12px;
  padding-left: 24px;
}

.circle {
  width: 12px;
  height: 12px;
  background-color: var(--grass);
  border-radius: 50%;
  position: absolute;
}

.ringring {
  border: 3px solid var(--deep-blue);
  border-radius: 30px;
  height: 12px;
  width: 12px;
  position: absolute;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 0.0;
  top: -3px;
  left: 21px;
}
@keyframes pulsate {
  0% {transform: scale(0.1, 0.1); opacity: 0.0;}
  50% {opacity: 1.0;}
  100% {transform: scale(1.1, 1.1); opacity: 0.0;}
}
</style>
