<template>
    <div class="page-content-container py-4 px-3">
        <div class="card shadow-sm mb-4 fixed-card-top">
            <div class="card-header">
                <h5 class="mb-0">{{ event.name }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Informação Geral</h6>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Promotora</label>
                            <div class="text-muted">{{ event.promoter }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Local</label>
                            <div class="text-muted">{{ event.venue }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Datas</label>
                            <div class="text-muted">{{ event.startDate }} - {{ event.endDate }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Estado</label>
                            <div class="text-muted">{{ event.venue }}</div>
                        </div>
                        <div class="btn-container">
                            <button v-if="followerState" type="button" class="btn btn-danger btn-cancelar" @click="ToggleFollowState">Deixar de Seguir</button>
                            <button v-else type="submit" class="btn btn-primary" @click="ToggleFollowState">Seguir</button>
                        </div>
                    </div>

                    <div class="col-md-3 border-start">
                        <h6>Artistas Confirmados</h6>
                        <el-table empty-text="Nenhum dado disponível" :data="paginatedPerformers" @row-click="GoToPerformerDetails" class="short-table" size="small" border>
                            <el-table-column prop="id" label="id" v-if="false" />
                            <el-table-column prop="groupName" label="Performer" width="250" />
                            <el-table-column prop="date" label="Data" />
                        </el-table>
                        <el-pagination layout="prev, pager, next"
                                       :total="event.performers.length"
                                       :page-size="performersPagination.pageSize"
                                       :current-page="performersPagination.page"
                                       @current-change="onPerformersPageChange"
                                       size="small" />
                    </div>



                    <div class="col-md-3 border-start">
                        <h6>Palcos</h6>
                        <el-table empty-text="Nenhum dado disponível" :data="paginatedStages" class="short-table" size="small" border>
                            <el-table-column prop="name" label="Nome" />
                        </el-table>
                        <el-pagination layout="prev, pager, next"
                                       :total="event.stages.length"
                                       :page-size="stagesPagination.pageSize"
                                       :current-page="stagesPagination.page"
                                       @current-change="onStagesPageChange"
                                       size="small" />

                        <div class="btn-container">
                            <button type="button" class="btn btn-primary" @click="openEventCalendarModal()">Consultar Horários</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="event.state === 'Concluído'" style="height: 100%;" class="card shadow-sm fixed-card">
            <div class="card-header">
                <h6 class="mb-0">Avaliações</h6>
            </div>
            <div class="card-body">
                <el-table empty-text="Nenhum dado disponível" :data="paginatedReviews" size="small" border>
                    <el-table-column prop="reviewer" label="Nome" />
                    <el-table-column prop="submissionDate"
                                     label="Data"
                                     width="90">
                        <template #default="{ row }">
                            {{ new Date(row.submissionDate).toLocaleDateString() }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Cartaz" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingLineup" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Organização" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingOrganization" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Acessos" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingInfrastructure" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Performers" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingPerformers" disabled :max="5" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="performerMVP" label="Melhor Performance" />
                    <el-table-column label="Observações">
                        <template #default="{ row }">
                            <el-tooltip class="item" effect="dark" :content="row.observations" placement="top">
                                <span class="truncate-text">{{ row.observations }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="btn-container" v-if="this.event.reviewedByUser == false">
                    <button v-if="event.state === 'Concluído'" type="button" class="btn btn-danger btn-cancelar" @click="openSubmitReviewModal()">Avaliar</button>
                </div>
                <el-pagination layout="prev, pager, next"
                               :total="event.reviews.length"
                               :page-size="reviewsPagination.pageSize"
                               :current-page="reviewsPagination.page"
                               @current-change="onReviewsPageChange"
                               size="small" />
            </div>
        </div>

        <div v-else class="card shadow-sm fixed-card warning-card" style="height: 150px;">
            <div class="card-header">
                <h6 class="mb-0">Avaliações</h6>
            </div>
            <div class="card-body">
                <div class="alert alert-warning" role="alert">
                    A seção de avaliações estará disponível apenas após a conclusão do evento. Por favor, volte mais tarde para deixar sua avaliação.
                </div>
            </div>
        </div>
    </div>
    <ModalEventCalendar @closeEventCalendarModal="toggleModalEventCalendar" :modalEventCalendarActive="modalEventCalendarActive" />
    <ModalSubmitReview @submitReviewCompleted="handleSubmitReviewCompleted" :modalSubmitReviewActive="modalSubmitReviewActive" />
</template>

<script>
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { authState } from '../../auth';
    import ModalEventCalendar from '@/components/PublicComponents/SubComponents/modalEventCalendar.vue';
    import ModalSubmitReview from '@/components/PublicComponents/SubComponents/modalSubmitReview.vue';

    export default {
        name: 'EventDetails',
        components: {
            ModalEventCalendar,
            ModalSubmitReview
        },
        data() {
            return {
                authState,
                modalEventCalendarActive: false,
                modalSubmitReviewActive: false,
                reviewsPagination: { page: 1, pageSize: 4 },
                performersPagination: { page: 1, pageSize: 6 },
                stagesPagination: { page: 1, pageSize: 4 },
                followerState: false,
                event: {
                    performers: [],
                    stages: [],
                    reviews: []
                }
            };
        },
        mounted() {
            const eventId = this.$route.params.id;
            this.fetchEventDetails(eventId);
            this.checkFollowerStatus(eventId);
        },
        computed: {
            paginatedPerformers() {
                const start = (this.performersPagination.page - 1) * this.performersPagination.pageSize;
                return this.event.performers.slice(start, start + this.performersPagination.pageSize);
            },
            paginatedStages() {
                const start = (this.stagesPagination.page - 1) * this.stagesPagination.pageSize;
                return this.event.stages.slice(start, start + this.stagesPagination.pageSize);
            },
            paginatedReviews() {
                const start = (this.reviewsPagination.page - 1) * this.reviewsPagination.pageSize;
                return this.event.reviews.slice(start, start + this.reviewsPagination.pageSize);
            }
        },
        methods: {
            onReviewsPageChange(page) {
                this.reviewsPagination.page = page;
            },
            onPerformersPageChange(page) {
                this.performersPagination.page = page;
            },
            onStagesPageChange(page) {
                this.stagesPagination.page = page;
            },
            GoToPerformerDetails(row) {
                this.$router.push({ name: 'PerformerDetails', params: { id: row.id } });
            },
            handleSubmitReviewCompleted() {
                this.toggleModalSubmitReview();
                this.refreshEventDetails();
            },
            toggleModalSubmitReview() {
                this.modalSubmitReviewActive = !this.modalSubmitReviewActive;
            },
            refreshEventDetails() {
                this.fetchEventDetails(this.$route.params.id);
            },
            toggleModalEventCalendar() {
                this.modalEventCalendarActive = !this.modalEventCalendarActive;
                return this.modalEventCalendarActive;
            },
            openEventCalendarModal() {
                this.modalEventCalendarActive = true;
            },
            openSubmitReviewModal() {
                this.modalSubmitReviewActive = true;
            },
            async fetchEventDetails(eventId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Events/GetEventDetails', {
                        params: {
                            eventId: eventId,
                            profileId: localStorage.getItem('profileId')
                        }
                    });

                    this.event = response.data || {
                        performers: [],
                        stages: [],
                        reviews: []
                    };
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async ToggleFollowState() {
                try {
                    const response = await axios.post('https://localhost:7216/api/Events/ToggleFollowEvent', {
                        EventId: this.$route.params.id,
                        ProfileId: localStorage.getItem('profileId')
                    });

                    if (response.data.following === true) {
                        this.followerState = true;
                        Swal.fire('Sucesso', 'Começou a seguir este evento.', 'success');
                    } else {
                        this.followerState = false;
                        Swal.fire('Sucesso', 'Deixou de seguir este evento.', 'success');
                    }
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async checkFollowerStatus() {
                try {
                    const response = await axios.post('https://localhost:7216/api/Events/CheckFollowingStatus', {
                        EventId: this.$route.params.id,
                        ProfileId: localStorage.getItem('profileId')
                    });

                    this.followerState = response.data.following === true;
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            }
        }
    };
</script>




<style scoped>
    .truncate-text {
        display: inline-block;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
    }

    .fixed-card-top {
        width: 100%;
        height: 370px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

        .fixed-card-top .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        .fixed-card-top .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .fixed-card {
        width: 100%;
        height: 400px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

        .fixed-card .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        .fixed-card .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .warning-card .card-body {
        padding: 1rem;
        background-color: #fff3cd;
    }

    .warning-card .alert {
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffeeba;
    }

    .n-data-table {
        font-size: 0.8rem;
    }
</style>