<template lang="html">
  <template v-if="isLoading">
    <page-view>
      <template v-slot:content>
        <loading></loading>
      </template>
    </page-view>
  </template>
  <template v-else>

<!--    Main page -->
    <page-view>
      <template v-slot:return>Вернуться</template>
      <template v-slot:header>{{ $route.params._id ? singleObject.name : 'Новый объект' }}
        <status-circle
          v-if="!!$route.params._id"
          :is-ready="singleObject.status"
          style="display: inline-block; padding-left: 8px"
        ></status-circle>
      </template>
      <template v-slot:content>
        <div class="content">
          <div class="card">
            <div class="section-header">Общее</div>
            <label>Название
              <text-input style="margin-top: 4px;" title="Название" v-model="singleObject.name"></text-input>
            </label>
            <label>Тип объекта
              <select-input
                style="margin-top: 4px;"
                :options="types"
                :model-value="singleObject.type"
                @input="setType"
              ></select-input>
            </label>

<!--            Type based fields-->
            <template v-if="singleObject.type === 'text'">
              <label>Описание
                <text-input style="margin-top: 4px;" type="textarea" rows="4" v-model="singleObject.description"></text-input>
              </label>
            </template>
            <template v-else-if="singleObject.type === 'audio'">
              <label>Аудио
                <file-input
                  style="margin-top: 4px;"
                  :file-name="audioFile().fileName"
                  accept="audio/*"
                  @input="setAudioFile"
                ></file-input>
              </label>
              <audio-player style="margin-top: 16px" :src="audioFile().url"></audio-player>
            </template>
          </div>
        </div>
      </template>
    </page-view>
  </template>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageView from '@/components/layouts/PageView.vue';
import Loading from '@/components/Loading.vue';
import { BaseObject, OBJECTS_FETCH } from '@/store/types';
import StatusCircle from '@/components/StatusCircle.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import SelectInput from '@/components/inputs/SelectInput.vue';
import FileInput from '@/components/inputs/FileInput.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';

@Options({
  components: {
    AudioPlayer,
    FileInput,
    SelectInput,
    TextInput,
    StatusCircle,
    Loading,
    PageView,
  },
})
export default class SingleObjectView extends Vue {
  public isLoading = true;

  public singleObject!: BaseObject;

  public types = [
    {
      title: 'Текст',
      value: 'text',
    },
    {
      title: 'Аудио',
      value: 'audio',
    },
    {
      title: 'Модель',
      value: 'object',
    },
    {
      title: 'Экскурсионный',
      value: 'excursion',
    },
  ];

  public files: { audio?: File, model?: File } = {};

  async created(): Promise<void> {
    this.$watch(() => this.singleObject?.type, (val: any) => {
      console.log(val);
    }, { deep: true });
    if (this.$route.params._id) {
      try {
        const objects: BaseObject[] = await this.$store.dispatch(OBJECTS_FETCH);
        this.singleObject = JSON.parse(JSON.stringify(objects.find((item) => item._id === this.$route.params._id) as BaseObject));

        if (this.singleObject) {
          this.isLoading = false;
        } else {
          this.$notifications.push({
            type: 'warning',
            title: 'Ошибка',
            message: 'Объект не найден',
          });
          this.$router.push('/objects');
        }
      } catch (e) {
        this.$notifications.push({
          type: 'warning',
          title: 'Ошибка',
          message: e.message,
        });
        this.$router.push('/objects');
      }
    } else {
      this.singleObject = {
        name: '',
        type: 'text',
        position: {
          lat: 0,
          lng: 0,
        },
        areas: [],
        description: '',
      };

      this.isLoading = false;
    }
  }

  public setType(type: string): void {
    // @ts-ignore
    this.singleObject.type = type;
    this.$forceUpdate();
  }

  public audioFile() {
    console.log('a');
    if (this.singleObject?.files) {
      const file = this.singleObject.files.find((item) => item.type === 'audio');

      if (file) {
        return {
          fileName: file.fileName,
          url: file.url,
        };
      }
    }

    return {
      fileName: '',
      url: '',
    };
  }

  public setAudioFile(file: { fileName: string, file: File }) {
    if (!file.file) {
      return;
    }

    if (!this.singleObject.files?.length) {
      this.singleObject.files = [];
    } else {
      this.singleObject.files = this.singleObject.files.filter((item) => item.type !== 'audio');
    }

    this.singleObject.files.push({
      fileName: file.fileName,
      url: URL.createObjectURL(file.file),
      type: 'audio',
    });
    console.log(this.singleObject.files);

    this.files.audio = file.file;
    console.log(this.singleObject);
    this.$forceUpdate();
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .card {
    flex: 1 1;
    padding: 16px;
    border-radius: 4px;
    background-color: var(--white);
    box-shadow: 2px 1px 4px 0 #70727D19;

    .section-header {
      font-weight: 500;
    }

    label {
      margin-top: 16px;
      display: block;
      color: var(--grafit);
      font-size: 14px;
    }
  }
}
</style>
