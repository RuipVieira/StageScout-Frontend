<template>
    <div class="page-content-container">
        <div class="about-container">
            <h1 class="mb-3 text-center">StageScout - Backoffice de Promotora</h1>
            <p>Benvindo ao backoffice da plataforma StageScout. Como promotora, tem acesso à gestão dos seus eventos.</p>
            <ul class="arrow-list">
                <li>Pode encontrar em baixo acesso aos seus eventos, ativos e concluídos.</li>
                <li>Pode aceder aos detalhes dos eventos e atualizar a informação referente aos mesmos.</li>
                <li>Nos eventos concluídos pode aceder ao levantamento de dados estatísticos e avaliações submetidas pelos utilizadores.</li>
            </ul>
            <button class="btn btn-primary"
                    @click="openCreateEventModal()">
                Criar Novo Evento
            </button>
        </div>
        <div class="card shadow-sm mb-4 fixed-card-top" v-if="authState.isLoggedIn">
            <div class="card-header">
                <h5 class="mb-0">A Seguir</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Eventos Ativos</h6>
                        <el-table :data="activeEvents" empty-text="Nenhum dado disponível" :stripe="true" style="width: 100%" @row-click="GoToEventDetails" :default-sort="{ prop: 'dataInicio', order: 'ascending' }">
                            <el-table-column prop="name" label="Nome"></el-table-column>
                            <el-table-column prop="location" label="Local"></el-table-column>
                            <el-table-column prop="startDate" label="Início"></el-table-column>
                            <el-table-column prop="endDate" label="Fim"></el-table-column>
                            <el-table-column prop="state" label="Estado"></el-table-column>
                        </el-table>

                        <el-pagination :current-page="activeEventsPagination.page"
                                       :page-size="activeEventsPagination.pageSize"
                                       :total="activeEvents.length"
                                       @current-change="onEventsPageChange"
                                       layout="prev, pager, next">
                        </el-pagination>
                    </div>

                    <div class="col-md-6">
                        <h6>Histórico de Eventos</h6>
                        <el-table :data="eventsHistory" empty-text="Nenhum dado disponível" highlight-current-row :stripe="true" style="width: 100%" @row-click="GoToEventStatsDetails" :default-sort="{ prop: 'data', order: 'ascending' }">
                            <el-table-column prop="name" label="Nome"></el-table-column>
                            <el-table-column prop="location" label="Local"></el-table-column>
                            <el-table-column prop="startDate" label="Início"></el-table-column>
                            <el-table-column prop="endDate" label="Fim"></el-table-column>
                            <el-table-column prop="reviewCount" label="Nmr de Avaliações" align="center"></el-table-column>
                        </el-table>

                        <el-pagination :current-page="eventsHistoryPagination.page"
                                       :page-size="eventsHistoryPagination.pageSize"
                                       :total="eventsHistory.length"
                                       @current-change="onEventsHistoryPageChange"
                                       layout="prev, pager, next">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CreateEventModal @closeCreateEventModal="toggleModalCreateEvent" :modalCreateEventActive="modalCreateEventActive" />
</template>

<script>
    import { authState } from '../../auth';
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import CreateEventModal from '../../Components/BackofficeComponents/SubComponents/modalCreateEvent.vue';

    export default {
        name: 'HeaderComponent',
        components: {
            CreateEventModal
        },
        data() {
            return {
                modalCreateEventActive: false,
                activeEventsPagination: {
                    page: 1,
                    pageSize: 6,
                },
                eventsHistoryPagination: {
                    page: 1,
                    pageSize: 6,
                },
                activeEvents: [],
                eventsHistory: [],
            };
        },

        computed: {
            authState() {
                return authState;
            }
        },

        created() {
            if (authState.isLoggedIn) {
                this.GetPromoterEventsLists();
            }
        },

        watch: {
            'authState.isLoggedIn'(newVal) {
                if (newVal) {
                    this.GetPromoterEventsLists();
                }
            }
        },

        methods: {
            onEventsPageChange(page) {
                this.activeEventsPagination.page = page;
            },

            onEventsHistoryPageChange(page) {
                this.eventsHistoryPagination.page = page;
            },

            GoToEventDetails(rowData) {
                this.$router.push({ name: 'BackOfficeEditEventView', params: { id: rowData.id } });
            },

            GoToEventStatsDetails(rowData) {
                this.$router.push({ name: 'BackOfficeEventStatsView', params: { id: rowData.id } });
            },
            toggleModalCreateEvent() {
                this.modalCreateEventActive = !this.modalCreateEventActive;
                if (!this.modalCreateEventActive) {
                    this.GetPromoterEventsLists();
                }
                return this.modalCreateEventActive;
            },
            openCreateEventModal() {
                this.modalCreateEventActive = true;
            },

            async GetPromoterEventsLists() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetPromoterEventsLists', {
                        params: {
                            profileId: localStorage.getItem('profileId'),
                        },
                    });

                    this.activeEvents = response.data.activeEvents || [];
                    this.eventsHistory = response.data.eventsHistory || [];
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
        },
    };
</script>

<style scoped>
    .about-container {
        margin: 2%;
    }

    ul.arrow-list {
        list-style: none;
        padding-left: 0;
    }

        ul.arrow-list li::before {
            content: "→ ";
            color: inherit;
        }
</style>