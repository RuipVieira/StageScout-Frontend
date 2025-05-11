<template>
    <div class="page-content-container py-4 px-3">
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
                        <div class="btn-container">
                            <button v-if="followerState" type="button" class="btn btn-danger btn-cancelar" @click="ToggleFollowState">Deixar de Seguir</button>
                            <button v-else type="submit" class="btn btn-primary" @click="ToggleFollowState">Seguir</button>
                        </div>
                    </div>

                    <div class="col-md-3 border-start">
                        <h6>Artistas Confirmados</h6>
                        <el-table :data="paginatedPerformers" @row-click="GoToPerformerDetails" class="short-table" size="small" border>
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
                        <el-table :data="paginatedPalcos" class="short-table" size="small" border>
                            <el-table-column prop="nome" label="Nome" />
                        </el-table>
                        <el-pagination layout="prev, pager, next"
                                       :total="event.palcos.length"
                                       :page-size="palcosPagination.pageSize"
                                       :current-page="palcosPagination.page"
                                       @current-change="onPalcosPageChange"
                                       size="small" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="event.estado === 'Concluído'" class="card shadow-sm fixed-card">
            <div class="card-header">
                <h6 class="mb-0">Avaliações</h6>
            </div>
            <div class="card-body">
                <el-table :data="paginatedEvents" size="small" border>
                    <el-table-column prop="date" label="Data" />
                    <el-table-column prop="location" label="Local" />
                    <el-table-column prop="event" label="Evento" />
                </el-table>
                <el-pagination layout="prev, pager, next"
                               :total="event.upcomingEvents.length"
                               :page-size="eventsPagination.pageSize"
                               :current-page="eventsPagination.page"
                               @current-change="onEventsPageChange"
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
</template>

<script>
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { authState } from '../../auth';

    export default {
        name: 'EventDetails',
        setup() {
            return {
                authState
            }
        },
        data() {
            return {
                eventsPagination: { page: 1, pageSize: 5 },
                performersPagination: { page: 1, pageSize: 6 },
                palcosPagination: { page: 1, pageSize: 6 },
                followerState: false,
                event: {
                    performers: [],
                    palcos: [],
                    upcomingEvents: []
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
            paginatedEvents() {
                const start = (this.eventsPagination.page - 1) * this.eventsPagination.pageSize;
                return this.event.upcomingEvents.slice(start, start + this.eventsPagination.pageSize);
            }
        },

        methods: {
            onEventsPageChange(page) {
                this.eventsPagination.page = page;
            },
            onPerformersPageChange(page) {
                this.performersPagination.page = page;
            },
            onPalcosPageChange(page) {
                this.palcosPagination.page = page;
            },
            GoToPerformerDetails(row) {
                this.$router.push({ name: 'PerformerDetails', params: { id: row.id } })
            },
            async fetchEventDetails(eventId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Events/GetEventDetails', {
                        params: {
                            eventId: eventId
                        }
                    });

                    this.event = response.data || [];
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },
            async ToggleFollowState() {
                try {
                    const response = await axios.post('https://localhost:7216/api/Events/ToggleFollowEvent', {
                        EventId: this.$route.params.id,
                        ProfileId: localStorage.getItem('profileId')
                    });

                    if (response.data.seguidor == true) {
                        this.followerState = true;
                        Swal.fire('Sucesso', 'Começou a seguir este evento.', 'success')
                    } else {
                        this.followerState = false;
                        Swal.fire('Sucesso', 'Deixou de seguir este evento.', 'success')
                    }
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },
            async checkFollowerStatus() {
                try {
                    const response = await axios.post('https://localhost:7216/api/Events/CheckFollowingStatus', {
                        EventId: this.$route.params.id,
                        ProfileId: localStorage.getItem('profileId')
                    });

                    if (response.data.seguidor == true) {
                        this.followerState = true;
                    } else {
                        this.followerState = false;
                    }

                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            }
        },
    };
</script>



<style scoped>
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