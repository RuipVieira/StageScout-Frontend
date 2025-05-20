<template>
    <div class="page-content-container py-4 px-3">
        <!-- Top Card: Group Info and Tables -->
        <div class="card shadow-sm mb-4 fixed-card-top">
            <div class="card-header">
                <h5 class="mb-0">{{ group.nome }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <!-- Left: General Info -->
                    <div class="col-md-4">
                        <h6>Informação Geral</h6>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Género</label>
                            <div class="text-muted">{{ group.generoMusical }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Origem</label>
                            <div class="text-muted">{{ group.nacionalidade }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Ano de Fundação</label>
                            <div class="text-muted">{{ group.anoFormacao }}</div>
                        </div>
                    </div>

                    <!-- Middle: Band Members Table -->
                    <div class="col-md-4 border-start">
                        <h6>Membros</h6>
                        <el-table :data="pagedMembers" empty-text="Nenhum dado disponível" class="short-table" style="width: 100%" size="small" border>
                            <el-table-column prop="nome" label="Nome" />
                            <el-table-column prop="nacionalidade" label="Nacionalidade" />
                            <el-table-column prop="ativo" label="Membro Atual">
                                <template #default="{ row }">
                                    <span>{{ row.ativo ? 'Sim' : 'Não' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination layout="prev, pager, next" size="small"
                                       :current-page="membersPagination.page"
                                       :page-size="membersPagination.pageSize"
                                       :total="group.artistas.length"
                                       @current-change="onMembersPageChange" />
                    </div>

                    <!-- Right: Albums Table -->
                    <div class="col-md-4 border-start">
                        <h6>Álbuns</h6>
                        <el-table :data="pagedAlbums" empty-text="Nenhum dado disponível" class="short-table" style="width: 100%" size="small" border>
                            <el-table-column prop="titulo" label="Título" />
                            <el-table-column prop="anoLancamento" label="Ano Lançamento" />
                        </el-table>
                        <el-pagination layout="prev, pager, next" size="small"
                                       :current-page="albumsPagination.page"
                                       :page-size="albumsPagination.pageSize"
                                       :total="group.albums.length"
                                       @current-change="onAlbumsPageChange" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Card: Upcoming Events -->
        <div class="card shadow-sm fixed-card" style="height: 100%;">
            <div class="card-header">
                <h6 class="mb-0">Próximos Eventos</h6>
            </div>
            <div class="card-body">
                <el-table :data="pagedEvents" empty-text="Nenhum dado disponível" style="width: 100%" @row-click="GoToEventDetails">
                    <el-table-column prop="id" label="id" v-if="false" />
                    <el-table-column prop="nome" label="Nome" />
                    <el-table-column prop="local" label="Local" />
                    <el-table-column prop="dataInicio" label="Data de Início" />
                    <el-table-column prop="dataFim" label="Data de Fim" />
                </el-table>
                <el-pagination layout="prev, pager, next"
                               :current-page="eventsPagination.page"
                               :page-size="eventsPagination.pageSize"
                               :total="group.eventosMarcados.length"
                               @current-change="onEventsPageChange" />
            </div>
        </div>
    </div>
</template>


<script>
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import { authState } from '../../auth';

    export default {
        name: 'ArtistDetails',
        setup() {
            return {
                authState
            }
        },

        data() {
            return {
                group: {
                    artistas: [],
                    albums: [],
                    eventosMarcados: []
                },
                followerState: false,
                eventsPagination: { page: 1, pageSize: 5 },
                membersPagination: { page: 1, pageSize: 6 },
                albumsPagination: { page: 1, pageSize: 6 }
            }
        },
        computed: {
            pagedMembers() {
                const start = (this.membersPagination.page - 1) * this.membersPagination.pageSize
                return this.group.artistas.slice(start, start + this.membersPagination.pageSize)
            },
            pagedAlbums() {
                const start = (this.albumsPagination.page - 1) * this.albumsPagination.pageSize
                return this.group.albums.slice(start, start + this.albumsPagination.pageSize)
            },
            pagedEvents() {
                const start = (this.eventsPagination.page - 1) * this.eventsPagination.pageSize
                return this.group.eventosMarcados.slice(start, start + this.eventsPagination.pageSize)
            }
        },
        mounted() {
            const performerId = this.$route.params.id;
            this.fetchPerformerDetails(performerId);
            this.checkFollowerStatus(performerId);
        },
        methods: {
            onEventsPageChange(page) {
                this.eventsPagination.page = page
            },
            onMembersPageChange(page) {
                this.membersPagination.page = page
            },
            onAlbumsPageChange(page) {
                this.albumsPagination.page = page
            },
            GoToEventDetails(row) {
                this.$router.push({ name: 'EventDetails', params: { id: row.id } })
            },
            
            async fetchPerformerDetails(performerId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Performers/GetPerformerDetails', {
                        params: {
                            performerId: performerId
                        }
                    });

                    this.group = response.data || {
                        artistas: [],
                        albums: [],
                        eventosMarcados: []
                    };
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },
        }
    }
</script>



<style scoped>
    /* Fixed size for all cards */
    .fixed-card-top {
        width: 100%; /* Full width or specify custom width */
        height: 370px; /* Fixed height for all cards */
        overflow: hidden; /* Prevent content overflow from being visible */
        margin-bottom: 1rem; /* Space between cards */
    }

        /* Make the card body scrollable if content overflows */
        .fixed-card-top .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        /* Optional: Adjust the header styling for consistency */
        .fixed-card-top .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .fixed-card {
        width: 100%; /* Full width or specify custom width */
        height: 400px; /* Fixed height for all cards */
        overflow: hidden; /* Prevent content overflow from being visible */
        margin-bottom: 1rem; /* Space between cards */
    }

        /* Make the card body scrollable if content overflows */
        .fixed-card .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        /* Optional: Adjust the header styling for consistency */
        .fixed-card .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    /* Adjust the DataTable's overall look */
    .n-data-table {
        font-size: 0.8rem; /* Smaller font for compact view */
    }
</style>