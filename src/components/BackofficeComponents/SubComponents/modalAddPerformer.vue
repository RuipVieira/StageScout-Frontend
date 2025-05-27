<template>
    <transition name="modal-animation">
        <div v-show="modalAddPerformerActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalAddPerformerActive" class="modal-inner">
                    <i @click="closeAddPerformerModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Novo Performer</h2>
                        <form @submit.prevent="edit">
                            <div class="form-control form-container text-center">
                                <label for="performerName" class="form-label">Performer</label>
                                <select id="performerName" v-model="performerName" class="form-control">
                                    <option v-for="performer in performersList" :key="performer.id" :value="performer.id">
                                        {{ performer.nome }}
                                    </option>
                                </select>

                                <label for="performerDate" class="form-label">Dia</label>
                                <input type="date" v-model="performerDate" id="performerDate" class="form-control" :min="eventStartDate" :max="eventEndDate">

                                <label for="performerHour" class="form-label">Hora</label>
                                <input type="time" v-model="performerHour" id="performerHour" class="form-control"/>    

                                <label for="performerStage" class="form-label">Palco</label>
                                <select id="performerStage" v-model="performerStage" class="form-control">
                                    <option v-for="stage in stagesList" :key="stage.id" :value="stage.id">
                                        {{ stage.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeAddPerformerModal()">Cancelar</button>
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
        name: 'AddPerformerModal',
        props: {
            modalAddPerformerActive: Boolean,
            eventDetails: Object,
        },
        computed: {
            eventStartDate() {
                return this.eventDetails?.dataInicio?.split('T')[0] || '';
            },
            eventEndDate() {
                return this.eventDetails?.dataFim?.split('T')[0] || '';
            }
        },
        data() {
            return {
                performersList: [],
                stagesList: [],
                performerName: '',
                performerDate: '',
                performerHour: '',
                performerStage: '',
            };
        },
        watch: {
            modalAddPerformerActive(val) {
                if (val) {
                    this.GetPerformers();
                    this.GetStages(this.eventDetails);
                }
            }
        },
        methods: {
            async GetPerformers() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllPerformers');
                    this.performersList = response.data;
                } catch (error) {
                    Swal.fire('Erro', error.response?.data?.message || 'Erro de pesquisa.', 'error');
                }
            },

            async GetStages(eventDetails) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetEventStages', {
                        params: {
                            EventId: eventDetails.id
                        }
                    });
                    this.stagesList = response.data;
                } catch (error) {
                    Swal.fire('Erro', error.response?.data?.message || 'Erro de pesquisa.', 'error');
                }
            },

            async edit() {
                try {
                    await axios.post('https://localhost:7216/api/Admin/AddEventPerformer', {
                        EventoId: this.eventDetails.id,
                        PerformerId: this.performerName,
                        Data: this.performerDate,
                        Hora: this.performerHour,
                        PalcoId: this.performerStage,
                    });

                    Swal.fire('Sucesso', 'Performer adicionado com sucesso!', 'success');
                    this.closeAddPerformerModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeAddPerformerModal() {
                this.performerName = '';
                this.performerDate = '';
                this.performerHour = '';
                this.performerStage = '';
                this.$emit('closeAddPerformerModal');
                this.$emit('refreshEventDetails');
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
