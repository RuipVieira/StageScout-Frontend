<template>
    <transition name="modal-animation">
        <div v-show="modalCreateEventActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalCreateEventActive" class="modal-inner">
                    <i @click="closeCreateEventModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Novo Evento</h2>
                        <form @submit.prevent="create">
                            <div class="form-control form-container text-center">
                                <label for="eventName" class="form-label">Nome</label>
                                <input type="text" v-model="eventName" id="eventName" class="form-control" required>

                                <label for="eventStartDate" class="form-label">Data de Início</label>
                                <input type="date" v-model="eventStartDate" id="eventStartDate" class="form-control" required>

                                <label for="eventEndDate" class="form-label">Data de Fim</label>
                                <input type="date" v-model="eventEndDate" id="eventEndDate" class="form-control" required>

                                <label for="eventVenue" class="form-label">Localização</label>
                                <select id="eventVenue" v-model="eventVenue" class="form-control">
                                    <option v-for="venue in venuesList" :key="venue.id" :value="venue.id">
                                        {{ venue.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeCreateEventModal()">Cancelar</button>
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
        name: 'CreateEventModal',
        props: ['modalCreateEventActive'],
        data() {
            return {
                venuesList: [],
                promotersList: [],
                eventName: '',
                eventStartDate: '',
                eventEndDate: '',
                eventVenue: '',
            };
        },
        watch: {
            modalCreateEventActive(val) {
                if (val) {
                    this.GetVenues();
                    this.GetPromoters();
                }
            }
        },
        methods: {
            async GetVenues() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllVenues');
                    this.venuesList = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async GetPromoters() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllPromoters');
                    this.promotersList = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async create() {
                const start = new Date(this.eventStartDate);
                const end = new Date(this.eventEndDate);

                if (end < start) {
                    Swal.fire('Erro', 'A data de fim não pode ser anterior à data de início.', 'error');
                    return;
                }

                try {
                    await axios.post('https://localhost:7216/api/Admin/PromoterCreateEvent', {
                        Name: this.eventName,
                        StartDate: this.eventStartDate,
                        EndDate: this.eventEndDate,
                        VenueId: parseInt(this.eventVenue),
                        PromoterId: parseInt(localStorage.getItem('profileId')),
                    });

                    Swal.fire('Sucesso', 'Evento criado com sucesso!', 'success');
                    this.closeCreateEventModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeCreateEventModal() {
                this.eventName = '';
                this.eventStartDate = '';
                this.eventEndDate = '';
                this.eventVenue = '';
                this.$emit('closeCreateEventModal');
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
