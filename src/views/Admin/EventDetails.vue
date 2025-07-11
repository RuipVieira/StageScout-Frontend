﻿<template>
    <div class="page-content-container py-4 px-3">
        <h1 class="mb-3 text-center">Administração - Gestão de Eventos</h1>
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
                            <div class="text-muted">{{ event.state }}</div>
                        </div>
                        <div class="btn-container text-center">
                            <button type="button" class="btn btn-primary" style="margin-right: 10px;" @click="openEditEventInformationModal()">Editar Informação</button>
                            <button type="button" class="btn btn-primary" @click="openAddPerformerModal()">Adicionar Performer</button>
                        </div>
                    </div>

                    <div class="col-md-3 border-start">
                        <h6>Artistas Confirmados</h6>
                        <el-table empty-text="Nenhum dado disponível" :data="paginatedPerformers" class="short-table" size="small" border>
                            <el-table-column prop="id" label="id" v-if="false" />
                            <el-table-column prop="groupName" label="Performer" />
                            <el-table-column prop="date" label="Data" />
                            <el-table-column align="center">
                                <template #default="scope">
                                    <div v-if="paginatedPerformers.length">
                                        <el-button type="primary"
                                                   size="small"
                                                   class="btn-editar"
                                                   circle
                                                   @click="openEditEventPerformerModal(scope.row.id)">
                                            <el-icon><Edit /></el-icon>
                                        </el-button>
                                        <el-button class="btn-cancelar"
                                                   type="danger"
                                                   size="small"
                                                   circle
                                                   @click="deleteEventPerformer(scope.row.id)">
                                            <el-icon><Delete /></el-icon>
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
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

                        <div class="btn-container text-center">
                            <button type="button" class="btn btn-primary" style="margin-right: 10px;" @click="openEventCalendarModal()">Consultar Horários</button>
                            <button type="button" class="btn btn-primary" @click="openEditEventStagesModal()">Alterar Palcos</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="event.state == 'Concluído'" style="height: 100%;" class="card shadow-sm fixed-card">
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
                    <el-table-column align="center">
                        <template #default="scope">
                            <div v-if="paginatedReviews.length">
                                <el-button v-if="scope.row.stateId !=2" type="primary"
                                           size="small"
                                           class="btn-editar"
                                           circle
                                           @click="toggleReviewVisibility(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button v-else class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="toggleReviewVisibility(scope.row.id)">
                                    <el-icon><Delete /></el-icon>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
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
                    A seção de avaliações estará disponível apenas após a conclusão do evento.
                </div>
            </div>
        </div>
    </div>
    <ModalEventCalendar @closeEventCalendarModal="toggleModalEventCalendar"
                        :modalEventCalendarActive="modalEventCalendarActive" />
    <ModalEditEventStages @closeEditEventStagesModal="toggleModalEditEventStages"
                        :modalEditEventStagesActive="modalEditEventStagesActive" :eventDetails="event" @refreshEventDetails="refreshEventDetails"/>
    <ModalAddPerformer @closeAddPerformerModal="toggleModalAddPerformer" :modalAddPerformerActive="modalAddPerformerActive" :eventDetails="event" @refreshEventDetails="refreshEventDetails" />
    <ModalEditEventPerformer @closeEditEventPerformerModal="toggleModalEditEventPerformer" :modalEditEventPerformerActive="modalEditEventPerformerActive" :eventPerformerId="eventPerformerId" :eventDetails="event" @refreshEventDetails="refreshEventDetails" />
    <ModalEditEventInformation @closeEditEventInformationModal="toggleModalEditEventInformation" :modalEditEventInformationActive="modalEditEventInformationActive" @refreshEventDetails="refreshEventDetails" :eventDetails="event" />
</template>

<script>
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { authState } from '../../auth';
    import ModalEventCalendar from '@/components/AdminComponents/SubComponents/modalEventCalendar.vue';
    import ModalAddPerformer from '@/components/AdminComponents/SubComponents/modalAddPerformer.vue';
    import ModalEditEventStages from '@/components/AdminComponents/SubComponents/modalEditEventStages.vue';
    import ModalEditEventInformation from '@/components/AdminComponents/SubComponents/modalEditEventInformation.vue';
    import ModalEditEventPerformer from '@/components/AdminComponents/SubComponents/modalEditEventPerformer.vue';
    import { Edit, Delete } from '@element-plus/icons-vue'

    export default {
        name: 'EventDetails',
        components: {
            Edit, Delete, ModalEventCalendar, ModalAddPerformer, ModalEditEventInformation, ModalEditEventPerformer, ModalEditEventStages
        },
        data() {
            return {
                authState,
                modalEventCalendarActive: false,
                modalAddPerformerActive: false,
                modalEditEventStagesActive: false,
                modalEditEventInformationActive: false,
                modalEditEventPerformerActive: false,
                eventPerformerId: null,
                reviewsPagination: { page: 1, pageSize: 4 },
                performersPagination: { page: 1, pageSize: 4 },
                stagesPagination: { page: 1, pageSize: 5 },
                followerState: false,
                event: {
                    performers: [],
                    stages: [],
                    reviews: [],
                    name: '',
                    promoter: '',
                    venue: '',
                    startDate: '',
                    endDate: '',
                    state: ''
                }
            };
        },
        mounted() {
            const eventId = this.$route.params.id;
            this.fetchEventDetails(eventId);
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
                this.$router.push({ name: 'AdminPerformerDetails', params: { id: row.id } });
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
            toggleModalEditEventStages() {
                this.modalEditEventStagesActive = !this.modalEditEventStagesActive;
                if (!this.modalEditEventStagesActive) {
                    this.refreshEventDetails();
                }
                return this.modalEditEventStagesActive;
            },
            openEditEventStagesModal() {
                this.modalEditEventStagesActive = true;
            },
            toggleModalEditEventInformation() {
                this.modalEditEventInformationActive = !this.modalEditEventInformationActive;
                if (!this.modalEditEventInformationActive) {
                    this.refreshEventDetails();
                }
                return this.modalEditEventInformationActive;
            },
            openEditEventInformationModal() {
                this.modalEditEventInformationActive = true;
            },
            toggleModalAddPerformer() {
                this.modalAddPerformerActive = !this.modalAddPerformerActive;
                if (!this.modalAddPerformerActive) {
                    this.refreshEventDetails();
                }
                return this.modalAddPerformerActive;
            },
            openAddPerformerModal() {
                this.modalAddPerformerActive = true;
            },
            toggleModalEditEventPerformer() {
                this.modalEditEventPerformerActive = !this.modalEditEventPerformerActive;
                if (!this.modalEditEventPerformerActive) {
                    this.refreshEventDetails();
                }
                return this.modalEditEventPerformerActive;
            },
            openEditEventPerformerModal(id) {
                this.eventPerformerId = id;
                this.modalEditEventPerformerActive = true;
            },
            async fetchEventDetails(eventId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Admin/GetEventDetails', {
                        params: {
                            eventId: eventId,
                            profileId: localStorage.getItem('profileId')
                        }
                    });

                    this.event = response.data || {};
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async toggleReviewVisibility(reviewId) {
                Swal.fire({
                    title: 'Aviso!',
                    text: "Vai alterar a visibilidade desta avaliação. Pretende continuar?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/ToggleReviewVisibility/${reviewId}`);
                            this.refreshEventDetails()
                            Swal.fire('Aviso!', 'Avaliação alterada com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            },
            deleteEventPerformer(id) {
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover este Performer do Evento?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteEventPerformer/${id}`);
                            this.refreshEventDetails()
                            Swal.fire('Aviso!', 'Performer do Evento apagado com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
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