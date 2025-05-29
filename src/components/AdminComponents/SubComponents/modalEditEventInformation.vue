<template>
    <transition name="modal-animation">
        <div v-show="modalEditEventInformationActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditEventInformationActive" class="modal-inner">
                    <i @click="closeEditEventInformationModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Evento</h2>
                        <form @submit.prevent="edit">
                            <div class="form-control form-container text-center">
                                <label for="eventName" class="form-label">Nome</label>
                                <input type="text" v-model="eventName" id="eventName" class="form-control" required>

                                <label for="eventStartDate" class="form-label">Data de Início</label>
                                <input type="date" v-model="eventStartDate" id="eventStartDate" class="form-control" required>

                                <label for="eventEndDate" class="form-label">Data de Fim</label>
                                <input type="date" v-model="eventEndDate" id="eventEndDate" class="form-control" required>

                                <label for="eventPromoter" class="form-label">Promotora</label>
                                <select id="eventPromoter" v-model="eventPromoter" class="form-control">
                                    <option v-for="promoter in promotersList" :key="promoter.id" :value="promoter.id">
                                        {{ promoter.descricao }}
                                    </option>
                                </select>

                                <label for="eventVenue" class="form-label">Localização</label>
                                <select id="eventVenue" v-model="eventVenue" class="form-control">
                                    <option v-for="venue in venuesList" :key="venue.id" :value="venue.id">
                                        {{ venue.nome }}
                                    </option>
                                </select>

                                <label for="eventState" class="form-label">Estado</label>
                                <select id="eventState" v-model="eventState" class="form-control">
                                    <option v-for="state in eventStatesList" :key="state.id" :value="state.id">
                                        {{ state.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeEditEventInformationModal()">Cancelar</button>
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
        name: 'EditEventInformationModal',
        props: {
            modalEditEventInformationActive: Boolean,
            eventDetails: Object,
        },
        data() {
            return {
                venuesList: [],
                promotersList: [],
                eventStatesList:[],
                eventName: '',
                eventStartDate: '',
                eventEndDate: '',
                eventVenue: '',
                eventPromoter: '',
                eventState:''
            };
        },
        watch: {
            modalEditEventInformationActive(val) {
                if (val) {
                    this.GetVenues();
                    this.GetPromoters();
                    this.GetEventStates();
                    this.populateEventData();
                }
            },
            eventDetails: {
                immediate: true,
                handler() {
                    this.populateEventData();
                },
            },
        },
        methods: {
            populateEventData() {
                if (this.eventDetails) {
                    this.eventName = this.eventDetails.nome || '';
                    this.eventStartDate = this.eventDetails.dataInicio || '';
                    this.eventEndDate = this.eventDetails.dataFim || '';
                    const promoter = this.promotersList.find(p => p.descricao === this.eventDetails.promotora);
                    this.eventPromoter = promoter ? promoter.id : "";
                    const venue = this.venuesList.find(v => v.nome === this.eventDetails.local);
                    this.eventVenue = venue ? venue.id : "";
                    const state = this.eventStatesList.find(v => v.name === this.eventDetails.estado);
                    this.eventState = state ? state.id : "";
                }
            },
            async GetPromoters() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllPromoters');
                    this.promotersList = response.data;

                    if (this.venuesList.length) this.populateEventData();
                } catch (error) {
                    Swal.fire('Erro', error.response?.data?.message || 'Erro de pesquisa.', 'error');
                }
            },

            async GetEventStates() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllEventStates');
                    this.eventStatesList = response.data;

                    if (this.eventStatesList.length) this.populateEventData();
                } catch (error) {
                    Swal.fire('Erro', error.response?.data?.message || 'Erro de pesquisa.', 'error');
                }
            },

            async GetVenues() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllVenues');
                    this.venuesList = response.data;

                    if (this.promotersList.length) this.populateEventData();
                } catch (error) {
                    Swal.fire('Erro', error.response?.data?.message || 'Erro de pesquisa.', 'error');
                }
            },
            async edit() {
                const start = new Date(this.eventStartDate);
                const end = new Date(this.eventEndDate);

                if (end < start) {
                    Swal.fire('Erro', 'A data de fim não pode ser anterior à data de início.', 'error');
                    return;
                }

                try {
                    await axios.post('https://localhost:7216/api/Admin/EditEventInformation', {
                        EventoId: this.eventDetails.id,
                        Nome: this.eventName,
                        DataInicio: this.eventStartDate,
                        DataFim: this.eventEndDate,
                        LocalizacaoId: parseInt(this.eventVenue),
                        PromotoraId: parseInt(this.eventPromoter),
                        EstadoId: parseInt(this.eventState)
                    });

                    Swal.fire('Sucesso', 'Evento editado com sucesso!', 'success');
                    this.closeEditEventInformationModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeEditEventInformationModal() {
                this.eventName = '';
                this.eventStartDate = '';
                this.eventEndDate = '';
                this.eventVenue = '';
                this.eventPromoter = '';
                this.eventState = '';
                this.$emit('closeEditEventInformationModal');
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
