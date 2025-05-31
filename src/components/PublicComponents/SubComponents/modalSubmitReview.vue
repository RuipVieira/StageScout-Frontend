<template>
    <transition name="modal-animation">
        <div v-show="modalSubmitReviewActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalSubmitReviewActive" class="modal-inner">
                    <i @click="closeSubmitReviewModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Avaliar Evento</h2>

                        <form @submit.prevent="submitReview">
                            <div class="form-control form-container">
                                <div class="rating-row">
                                    <label class="form-label">Cartaz</label>
                                    <el-rate v-model="ratingLineup" :max="5" />
                                </div>

                                <div class="rating-row">
                                    <label class="form-label">Organização</label>
                                    <el-rate v-model="ratingOrganization" :max="5" />
                                </div>

                                <div class="rating-row">
                                    <label class="form-label">Acessos</label>
                                    <el-rate v-model="ratingInfrastructure" :max="5" />
                                </div>

                                <div class="rating-row">
                                    <label class="form-label">Performers</label>
                                    <el-rate v-model="ratingPerformers" :max="5" />
                                </div>

                                <label for="performerMVP" class="form-label mt-3">Melhor Performance</label>
                                <select v-model="performerMVP" id="performerMVP" class="form-control" required>
                                    <option value="" disabled>Selecione um performer</option>
                                    <option v-for="performer in performersList" :key="performer.id" :value="performer.id">
                                        {{ performer.name }}
                                    </option>
                                </select>

                                <label for="observations" class="form-label mt-3">Observações</label>
                                <textarea id="observations"
                                          v-model="observations"
                                          class="form-control"
                                          rows="3"
                                          placeholder="Deixe aqui os seus comentários..."></textarea>
                            </div>

                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeSubmitReviewModal">Cancelar</button>
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
        name: 'EventReviewModal',
        props: ['modalSubmitReviewActive'],
        data() {
            return {
                ratingLineup: 0,
                ratingOrganization: 0,
                ratingInfrastructure: 0,
                ratingPerformers: 0,
                performerMVP: '',
                observations: '',
                performersList: []
            };
        },
        methods: {
            closeSubmitReviewModal() {
                this.ratingLineup = 0;
                this.ratingOrganization = 0;
                this.ratingInfrastructure = 0;
                this.ratingPerformers = 0;
                this.performerMVP = '';
                this.observations = '';
                this.$emit('submitReviewCompleted');
            },
            async fetchPerformers(eventId) {
                try {
                    const response = await axios.get(`https://localhost:7216/api/Events/GetEventPerformers`, {
                        params: {
                            eventId: eventId
                        }
                    });
                    this.performersList = response.data || [];
                } catch (error) {
                    console.error('Erro ao buscar performers:', error);
                }
            },
            async submitReview() {
                if (
                    this.ratingLineup === 0 ||
                    this.ratingOrganization === 0 ||
                    this.ratingInfrastructure === 0 ||
                    this.ratingPerformers === 0
                ) {
                    Swal.fire('Atenção', 'Preencha todas as classificações.', 'warning');
                    return;
                }

                if (!this.performerMVP) {
                    Swal.fire('Atenção', 'Selecione um MVP.', 'warning');
                    return;
                }

                try {
                    await axios.post('https://localhost:7216/api/Events/SubmitReview', {
                        ProfileId: localStorage.getItem('profileId'),
                        RatingLineup: this.ratingLineup,
                        RatingOrganization: this.ratingOrganization,
                        RatingInfrastructure: this.ratingInfrastructure,
                        RatingPerformers: this.ratingPerformers,
                        PerformerMVP: this.performerMVP,
                        Observations: this.observations,
                        EventId: this.$route.params.id
                    });

                    Swal.fire('Sucesso', 'Avaliação submetida com sucesso!', 'success');
                    this.$emit('submitReviewCompleted');
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao registar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            }
        },
        mounted() {
            const eventId = this.$route.params.id;
            this.fetchPerformers(eventId);
        }
    };
</script>


<style scoped>
    .rating-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

        .rating-row .form-label {
            margin: 0;
            flex: 1;
            text-align: left;
        }

        .rating-row .el-rate {
            flex-shrink: 0;
        }

    .modal-animation-enter-active,
    .modal-animation-leave-active {
        transition: opacity 0.3s ease;
    }

    .modal-animation-inner-enter-active,
    .modal-animation-inner-leave-active {
        transition: all 0.3s ease;
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
    }

    .modal-inner {
        position: relative;
        max-width: 400px;
        width: 90%;
        background-color: #fff;
        padding: 40px 20px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

        .modal-inner i {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 20px;
            cursor: pointer;
        }

            .modal-inner i:hover {
                color: crimson;
            }
</style>