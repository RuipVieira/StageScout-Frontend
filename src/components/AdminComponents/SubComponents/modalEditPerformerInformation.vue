<template>
    <transition name="modal-animation">
        <div v-show="modalEditPerformerInformationActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditPerformerInformationActive" class="modal-inner">
                    <i @click="closeEditPerformerInformationModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Performer</h2>
                        <form @submit.prevent="edit">
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
                                        {{ genre.nome }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeEditPerformerInformationModal()">Cancelar</button>
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
        name: 'EditPerformerInformationModal',
        props: {
            modalEditPerformerInformationActive: Boolean,
            performerDetails: Object,
        },
        data() {
            return {
                nationsList: [],
                genresList: [],
                performerName: '',
                performerNacionalidade: '',
                performerYear: '',
                performerGeneroMusical: '',
            };
        },
        watch: {
            modalEditPerformerInformationActive(val) {
                if (val) {
                    this.GetNations();
                    this.GetMusicGenres();
                }
            },
            performerDetails: {
                immediate: true,
                handler() {
                    this.populatePerformerData();
                },
            },
        },
        methods: {
            populatePerformerData() {
                if (this.performerDetails) {
                    this.performerName = this.performerDetails.nome || '';
                    this.performerYear = this.performerDetails.anoFormacao || '';
                    const country = this.nationsList.find(v => v.descricao === this.performerDetails.nacionalidade);
                    this.performerNacionalidade = country ? country.id : "";
                    const genre = this.genresList.find(v => v.nome === this.performerDetails.generoMusical);
                    this.performerGeneroMusical = genre ? genre.id : "";
                }
            },
            async GetNations() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllNations');
                    this.nationsList = response.data;
                    this.populatePerformerData();
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
                    this.populatePerformerData();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async edit() {
                try {
                    console.log(this.performerDetails);
                    await axios.post('https://localhost:7216/api/Admin/EditPerformerInformation', {
                        PerformerId: this.performerDetails.id,
                        Nome: this.performerName,
                        AnoFormacao: this.performerYear,
                        NacionalidadeId: this.performerNacionalidade,
                        GeneroMusicalId: this.performerGeneroMusical,                        
                    });

                    Swal.fire('Sucesso', 'Performer editado com sucesso!', 'success');
                    this.closeEditPerformerInformationModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao editar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeEditPerformerInformationModal() {
                
                this.$emit('closeEditPerformerInformationModal');
                this.$emit('refreshPerformerDetails');
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
