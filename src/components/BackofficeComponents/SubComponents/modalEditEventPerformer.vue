<template>
    <transition name="modal-animation">
        <div v-show="modalEditEventPerformerActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditEventPerformerActive" class="modal-inner">
                    <i @click="closeEditEventPerformerModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Novo Performer</h2>
                        <form @submit.prevent="edit">
                            <div class="form-control form-container text-center">
                                <label for="epPerformerId" class="form-label">Performer</label>
                                <select id="epPerformerId" v-model="epPerformerId" class="form-control">
                                    <option v-for="performer in performersList" :key="performer.id" :value="performer.id">
                                        {{ performer.name }}
                                    </option>
                                </select>

                                <label for="epDate" class="form-label">Dia</label>
                                <input type="date" v-model="epDate" id="epDate" class="form-control" :min="eventStartDate" :max="eventEndDate">

                                <label for="epHour" class="form-label">Hora</label>
                                <input type="time" v-model="epHour" id="epHour" class="form-control" />

                                <label for="epStage" class="form-label">Palco</label>
                                <select id="epStage" v-model="epStage" class="form-control">
                                    <option v-for="stage in stagesList" :key="stage.id" :value="stage.id">
                                        {{ stage.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeEditEventPerformerModal()">Cancelar</button>
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
        name: 'EditEventPerformerModal',
        props: {
            modalEditEventPerformerActive: Boolean,
            eventDetails: Object,
            eventPerformerId: Number
        },
        computed: {
            eventStartDate() {
                return this.eventDetails?.startDate?.split('T')[0] || '';
            },
            eventEndDate() {
                return this.eventDetails?.endDate?.split('T')[0] || '';
            }
        },
        data() {
            return {
                performersList: [],
                stagesList: [],
                epPerformerId: '',
                epDate: '',
                epHour: '',
                epStage: '',
            };
        },
        watch: {
            modalEditEventPerformerActive(val) {
                if (val) {
                    this.GetPerformers();
                    this.GetStages(this.eventDetails);
                    this.GetEventPerformerDetails(this.eventPerformerId);
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

            async GetEventPerformerDetails(epId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetEventPerformerDetails', {
                        params: {
                            EventPerformerId: epId
                        }
                    });
                    const data = response.data;
                    this.epPerformerId = data.performerId;
                    this.epDate = data.data;
                    this.epHour = data.hora;
                    this.epStage = data.palcoId;

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
                    await axios.post('https://localhost:7216/api/Admin/EditEventPerformer', {
                        EventPerformerId: this.eventPerformerId,
                        EventId: this.eventDetails.id,
                        PerformerId: this.epPerformerId,
                        Date: this.epDate,
                        Time: this.epHour,
                        StageId: this.epStage,
                    });

                    Swal.fire('Sucesso', 'Performer adicionado com sucesso!', 'success');
                    this.closeEditEventPerformerModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeEditEventPerformerModal() {
                this.epPerformerId = '';
                this.epDate = '';
                this.epHour = '';
                this.epStage = '';
                this.$emit('closeEditEventPerformerModal');
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
