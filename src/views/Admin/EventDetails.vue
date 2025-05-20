<template>
    <div class="page-content-container py-4 px-3">
        <h1 class="mb-3 text-center">Administração - Gestão de Eventos</h1>
        <div class="card shadow-sm mb-4 fixed-card-top">
            <div class="card-header">
                <h5 class="mb-0">{{ event.nome }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Informação Geral</h6>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Promotora</label>
                            <div class="text-muted">{{ event.promotora }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Local</label>
                            <div class="text-muted">{{ event.local }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Datas</label>
                            <div class="text-muted">{{ event.dataInicio }} - {{ event.dataFim }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Estado</label>
                            <div class="text-muted">{{ event.estado }}</div>
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
                        <el-table empty-text="Nenhum dado disponível" :data="paginatedPalcos" class="short-table" size="small" border>
                            <el-table-column prop="nome" label="Nome" />
                        </el-table>
                        <el-pagination layout="prev, pager, next"
                                       :total="event.palcos.length"
                                       :page-size="palcosPagination.pageSize"
                                       :current-page="palcosPagination.page"
                                       @current-change="onPalcosPageChange"
                                       size="small" />

                        <div class="btn-container">
                            <button v-if="event.estado === 'Concluído'" type="button" class="btn btn-primary" @click="openEventCalendarModal()">Consultar Horários</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="event.estado === 'Concluído'" style="height: 100%;" class="card shadow-sm fixed-card">
            <div class="card-header">
                <h6 class="mb-0">Avaliações</h6>
            </div>
            <div class="card-body">
                <el-table empty-text="Nenhum dado disponível" :data="paginatedAvaliacoes" size="small" border>
                    <el-table-column prop="nomeAvaliador" label="Nome" />
                    <el-table-column prop="dataSubmissao"
                                     label="Data"
                                     width="90">
                        <template #default="{ row }">
                            {{ new Date(row.dataSubmissao).toLocaleDateString() }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Cartaz" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingCartaz" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Organização" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingOrganizacao" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Acessos" width="130">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingAcessos" disabled :max="5" />
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
                            <el-tooltip class="item" effect="dark" :content="row.observacoes" placement="top">
                                <span class="truncate-text">{{ row.observacoes }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="prev, pager, next"
                               :total="event.avaliacoes.length"
                               :page-size="avaliacoesPagination.pageSize"
                               :current-page="avaliacoesPagination.page"
                               @current-change="onAvaliacoesPageChange"
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
    <ModalEventCalendar @closeEventCalendarModal="toggleModalEventCalendar" :modalEventCalendarActive="modalEventCalendarActive" />
    <ModalSubmitReview @submitReviewCompleted="handleSubmitReviewCompleted" :modalSubmitReviewActive="modalSubmitReviewActive" />
</template>

<script>
    import Swal from 'sweetalert2';
    import { ref } from 'vue';
    import axios from 'axios';
    import { authState } from '../../auth';
    import ModalEventCalendar from '@/components/PublicComponents/SubComponents/modalEventCalendar.vue';

    export default {
        name: 'EventDetails',
        components: {
            ModalEventCalendar
        },
        setup() {
            let modalEventCalendarActive = ref(false);

            return {
                authState, modalEventCalendarActive
            }
        },
        data() {
            return {
                avaliacoesPagination: { page: 1, pageSize: 4 },
                performersPagination: { page: 1, pageSize: 6 },
                palcosPagination: { page: 1, pageSize: 4 },
                followerState: false,
                event: {
                    performers: [],
                    palcos: [],
                    avaliacoes: []
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
            paginatedPalcos() {
                const start = (this.palcosPagination.page - 1) * this.palcosPagination.pageSize;
                return this.event.palcos.slice(start, start + this.palcosPagination.pageSize);
            },
            paginatedAvaliacoes() {
                const start = (this.avaliacoesPagination.page - 1) * this.avaliacoesPagination.pageSize;
                return this.event.avaliacoes.slice(start, start + this.avaliacoesPagination.pageSize);
            }
        },

        methods: {
            onAvaliacoesPageChange(page) {
                this.avaliacoesPagination.page = page;
            },
            onPerformersPageChange(page) {
                this.performersPagination.page = page;
            },
            onPalcosPageChange(page) {
                this.palcosPagination.page = page;
            },
            GoToPerformerDetails(row) {
                this.$router.push({ name: 'AdminPerformerDetails', params: { id: row.id } })
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
            async fetchEventDetails(eventId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Events/GetEventDetails', {
                        params: {
                            eventId: eventId,
                            profileId: localStorage.getItem('profileId')
                        }
                    });

                    this.event = response.data || [];
                    console.log(this.event);
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },
        },
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