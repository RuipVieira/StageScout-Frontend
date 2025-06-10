<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Backoffice - Gestão de Avaliações</h1>
        <div class="d-flex flex-row">
            <div class="filter-section me-4 flex-shrink-0" style="width: 200px;">
                <form @submit.prevent>
                    <div class="form-control p-3 filter-form">
                        <h4 class="mb-3">Filtros</h4>
                        <div class="mb-3">
                            <label class="form-label">Idade</label>
                            <div class="d-flex gap-2">
                                <input v-model.number="filters.minAge" type="number" class="form-control form-control-sm" placeholder="Mín" />
                                <input v-model.number="filters.maxAge" type="number" class="form-control form-control-sm" placeholder="Máx" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="usernationality" class="form-label">Nacionalidade</label>
                            <input v-model="filters.usernationality" type="text" id="usernationality" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="usercity" class="form-label">Cidade</label>
                            <input v-model="filters.usercity" type="text" id="usercity" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="performerMVP" class="form-label">MVP</label>
                            <input v-model="filters.mvp" type="text" id="performerMVP" class="form-control" />
                        </div>
                        <button type="button" class="btn btn-danger btn-cancelar mt-2" @click="clearFilters">Limpar</button>
                    </div>
                </form>
                <div class="summary-section mt-4">
                    <h4>Resumo:</h4>
                    <p><strong>Média Cartaz:</strong> {{ averageRatings.lineup }}</p>
                    <p><strong>Média Organização:</strong> {{ averageRatings.organization }}</p>
                    <p><strong>Média Acessos:</strong> {{ averageRatings.infrastructure }}</p>
                    <p><strong>Média Performers:</strong> {{ averageRatings.performers }}</p>
                    <p><strong>Performer MVP:</strong> {{ mostSelectedMVP }}</p>
                </div>
            </div>

            <div class="table-section overflow-auto flex-grow-1">
                <el-table :data="paginatedAvaliacoes.length ? paginatedAvaliacoes : [{}]"
                          stripe
                          style="width: 100%;"
                          class="mb-4">
                    <el-table-column prop="userName" label="Nome" sortable>
                        <template #default="scope">
                            <span v-if="scope.row.userName">{{ scope.row.userName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userAge" label="Idade" sortable :width="85">
                        <template #default="scope">
                            <span v-if="scope.row.userAge">{{ scope.row.userAge }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userGender" label="Sexo" sortable :min-width="90">
                        <template #default="scope">
                            <span v-if="scope.row.userGender">{{ scope.row.userGender }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userNationality" label="Nacionalidade" sortable :min-width="140">
                        <template #default="scope">
                            <span v-if="scope.row.userNationality">{{ scope.row.userNationality }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userDistrict" label="Distrito" sortable :min-width="120">
                        <template #default="scope">
                            <span v-if="scope.row.userDistrict">{{ scope.row.userDistrict }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Cartaz" :min-width="120">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingLineup" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Organização" :min-width="120">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingOrganization" disabled :max="5" />
                        </template>
                    </el-table-column>

                    <el-table-column label="Acessos" :min-width="120">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingInfrastructure" disabled :max="5" />
                        </template>
                    </el-table-column>
                    <el-table-column label="Performers" :min-width="120">
                        <template #default="{ row }">
                            <el-rate :model-value="row.ratingPerformers" disabled :max="5" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="performerMVP" label="Performer MVP" :min-width="120" />
                    <el-table-column label="Observações" :min-width="120">
                        <template #default="{ row }">
                            <el-tooltip class="item" effect="dark" :content="row.observations" placement="top">
                                <span class="truncate-text">{{ row.observations }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="d-flex justify-content-center">
                    <el-pagination layout="prev, pager, next"
                                   :total="reviewsList.length"
                                   :page-size="pagination.pageSize"
                                   :current-page="pagination.page"
                                   @current-change="onPageChange" />
                </div>
            </div>
        </div>
        
    </div>
</template>


<script>
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { ElTable, ElTableColumn, ElRate, ElPagination, ElTooltip } from 'element-plus';

    export default {
        data() {
            return {
                filters: {
                    minAge: null,
                    maxAge: null,
                    usernationality: '',
                    usercity: '',
                    mvp: ''
                },
                reviewsList: [],
                pagination: {
                    page: 1,
                    pageSize: 10
                }
            };
        },
        computed: {
            filteredData() {
                return this.reviewsList.filter(item => {
                    return (
                        (!this.filters.minAge || item.userAge >= this.filters.minAge) &&
                        (!this.filters.maxAge || item.userAge <= this.filters.maxAge) &&
                        (!this.filters.usernationality || item.userNationality.toLowerCase().includes(this.filters.usernationality.toLowerCase())) &&
                        (!this.filters.usercity || item.userDistrict.toLowerCase().includes(this.filters.usercity.toLowerCase())) &&
                        (!this.filters.mvp || item.performerMVP?.toLowerCase().includes(this.filters.mvp.toLowerCase()))
                    );
                });
            },
            paginatedAvaliacoes() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize;
                const end = start + this.pagination.pageSize;
                return this.filteredData.slice(start, end);
            },
            averageRatings() {
                const getAvg = arr =>
                    arr.length ? (arr.reduce((sum, v) => sum + v, 0) / arr.length).toFixed(1) : 'N/A';

                const lineup = this.filteredData.map(i => i.ratingLineup).filter(n => n != null);
                const organization = this.filteredData.map(i => i.ratingOrganization).filter(n => n != null);
                const infrastructure = this.filteredData.map(i => i.ratingInfrastructure).filter(n => n != null);
                const performers = this.filteredData.map(i => i.ratingPerformers).filter(n => n != null);

                return {
                    lineup: getAvg(lineup),
                    organization: getAvg(organization),
                    infrastructure: getAvg(infrastructure),
                    performers: getAvg(performers)
                };
            },
            mostSelectedMVP() {
                const counts = this.filteredData.reduce((acc, item) => {
                    if (item.performerMVP && item.performerMVP.trim() !== '') {
                        const name = item.performerMVP.trim();
                        acc[name] = (acc[name] || 0) + 1;
                    }
                    return acc;
                }, {});

                const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

                return sorted.length > 0 ? sorted[0][0] : 'N/A';
            }

        },
        mounted() {
            const eventId = this.$route.params.id;
            this.fetchReviews(eventId);
        },
        methods: {
            onPageChange(page) {
                this.pagination.page = page;
            },
            clearFilters() {
                this.filters = {
                    username: '',
                    userage: '',
                    usernationality: '',
                    usercity: '',
                    mvp: ''
                };
                this.pagination.page = 1;
            },
            async fetchReviews(eventId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetEventReviewStatistics', {
                        params: {
                            eventId: eventId,
                        }
                    });

                    this.reviewsList = response.data || {};
                    console.log(this.reviewsList)
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            }
        }
    };
</script>

<style scoped>
    .filter-form {
        max-width: 200px; 
        padding: 1rem 1rem; 
        box-sizing: border-box;
    }

    .form-control-sm {
        font-size: 0.85rem;
    }

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