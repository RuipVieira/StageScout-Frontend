import { reactive } from 'vue';

export const authState = reactive({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
});