<template>
    <transition name="modal-animation">
        <div v-show="modalCreateMusicGenreActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalCreateMusicGenreActive" class="modal-inner">
                    <i @click="closeCreateMusicGenreModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Novo Género Musical</h2>
                        <form @submit.prevent="create">
                            <div class="form-control form-container text-center">
                                <label for="genreName" class="form-label">Nome</label>
                                <input type="text" v-model="genreName" id="genreName" class="form-control" required>
                            </div>

                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeCreateMusicGenreModal()">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import axios from 'axios';
    import Swal from 'sweetalert2';

    export default {
        name: 'CreateMusicGenreModal',
        props: ['modalCreateMusicGenreActive'],
        data() {
            return {
                genreName: '',
            };
        },
        methods: {
            async create() {
                try {
                    await axios.post(
                        'https://localhost:7216/api/Admin/CreateGenre',
                        JSON.stringify(this.genreName),
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    Swal.fire('Sucesso', 'Género criado com sucesso!', 'success');
                    this.closeCreateMusicGenreModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeCreateMusicGenreModal() {
                this.genreName = '';
                this.$emit('closeCreateMusicGenreModal');
            },
        }
    };
</script>

<style scoped>
    .modal-animation-enter-active,
    .modal-animation-leave-active {
        transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-enter-from,
    .modal-animation-leave-to {
        opacity: 0;
    }

    .modal-animation-inner-enter-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
    }

    .modal-animation-inner-leave-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-inner-enter-from {
        opacity: 0;
        transform: scale(0.8);
    }

    .modal-animation-inner-leave-to {
        transform: scale(0.8);
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
        .modal-inner

    {
        position: relative;
        max-width: 300px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        padding: 50px 10px 10px 10px;
        i

    {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
        &:hover

    {
        color: crimson;
    }

    }
    }
    }
</style>
