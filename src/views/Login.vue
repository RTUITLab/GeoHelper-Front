<template>
  <div class="login-card">
    <logo />
    <div class="title">Войти</div>
    <form @submit.prevent="login">
      <text-input type="text" title="Логин" v-model="credentials.username"></text-input>
      <text-input type="password" title="Пароль" v-model="credentials.password"></text-input>
      <checkbox :model-value="remember" @update="(e) => remember = e">Запомнить меня</checkbox>
      <c-button type="submit" variant="primary" style="margin: 48px 0 20px">Вход</c-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Logo from '@/assets/svg/Logo.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import Checkbox from '@/components/inputs/Checkbox.vue';
import CButton from '@/components/CButton.vue';
import { LOGIN } from '@/store/types';

@Options({
  components: {
    CButton,
    Checkbox,
    TextInput,
    Logo,
  },
})
export default class Login extends Vue {
  private credentials = {
    username: '',
    password: '',
  }

  private remember = false;

  async login(): Promise<void> {
    try {
      await this.validate();
      if (await this.$store.dispatch(LOGIN, {
        credentials: this.credentials,
        remember: this.remember,
      })) {
        await this.$router.push('/objects');
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  validate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.credentials.username) {
        reject(new Error('Не задано имя пользователя'));
      } else if (!this.credentials.password) {
        reject(new Error('Не задан пароль'));
      }
      resolve();
    });
  }
}
</script>

<style lang="scss" scoped>
.login-card {
  width: 350px;
  margin: auto;
  padding: 24px;
  box-sizing: border-box;

  background-color: var(--white);
  border-radius: 4px;
  box-shadow: 2px 1px 4px 0 #70727D19;

  .title {
    margin-top: 16px;
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
