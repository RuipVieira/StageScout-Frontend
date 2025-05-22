<template>
    <transition name="modal-animation">
        <div v-show="modalCreatePerformerActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalCreatePerformerActive" class="modal-inner">
                    <i @click="closeCreatePerformerModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Novo Performer</h2>
                        <form @submit.prevent="create">
                            <div class="form-control form-container text-center">
                                <label for="performerName" class="form-label">Nome</label>
                                <input type="text" v-model="performerName" id="performerName" class="form-control" required>

                                <label for="performerYear" class="form-label">Ano de Formação</label>
                                <input type="number" v-model="performerYear" id="performerYear" class="form-control" required min="1200" step="1">

                                <label for="performerNacionalidade" class="form-label">Nacionalidade</label>
                                <select id="performerNacionalidade" v-model="performerNacionalidade" class="form-control">
                                    <option v-for="nation in nationsList" :key="nation.id" :value="nation.id">
                                        {{ nation.descricao }}
                                    </option>
                                </select>

                                <label for="performerGeneroMusical" class="form-label">Género Musical</label>
                                <select id="performerGeneroMusical" v-model="performerGeneroMusical" class="form-control">
                                    <option v-for="genre in genresList" :key="genre.id" :value="genre.id">
                                        {{ genre.descricao }}
                                    </option>
                                </select>
                            </div>

                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeCreatePerformerModal()">Cancelar</button>
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
        name: 'CreatePerformerModal',
        props: ['modalCreatePerformerActive'],
        data() {
            return {
                nationsList: [],
                genresList:[],
                performerName: '',
                performerNacionalidade: '',
                performerYear: '',
                performerGeneroMusical: '',
            };
        },
        watch: {
            modalCreatePerformerActive(val) {
                if (val) {
                    this.GetNations();
                    this.GetMusicGenres();
                }
            }
        },
        methods: {
            async GetNations() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllNations');
                    this.nationsList = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async GetMusicGenres() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllMusicGenres');
                    this.genresList = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async create() {
                try {
                    await axios.post('https://localhost:7216/api/Admin/CreatePerformer', {
                        Nome: this.performerName,
                        NacionalidadeId: this.performerNacionalidade,
                        AnoFormacao: this.performerYear,
                        GeneroMusicalId: this.performerGeneroMusical
                    });

                    Swal.fire('Sucesso', 'Performer criado com sucesso!', 'success');
                    this.closeCreatePerformerModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeCreatePerformerModal() {
                this.PerformerName = '';
                this.PerformerNacionalidade = '';
                this.PerformerYear = '';
                this.PerformerGeneroMusical = '';
                this.$emit('closeCreatePerformerModal');
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
