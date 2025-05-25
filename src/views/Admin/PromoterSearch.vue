<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Promotoras</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="promoterName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="promoterName" class="form-control" />
                        </div>
                        <button type="button" class="btn btn-danger btn-cancelar mt-2" @click="clearFilters">Limpar</button>
                    </div>
                </form>
            </div>

            <div class="table-section overflow-auto">
                <el-table :data="paginatedData.length ? paginatedData : [{}]"
                          stripe
                          style="width: 100%; min-width: 1200px;"
                          class="mb-4">
                    <el-table-column prop="nome"
                                     label="Nome"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.nome">{{ scope.row.nome }}</span>
                            <span v-else-if="!paginatedData.length" class="text-muted">Nenhum dado disponível</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="eventsCount"
                                     label="Contagem Eventos"
                                     width="200"
                                     align="center"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.eventsCount">{{ scope.row.eventsCount }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="150"
                                     align="center">
                        <template #default="scope">
                            <div v-if="paginatedData.length">
                                <el-button type="primary"
                                           size="small"
                                           class="btn-editar"
                                           circle
                                           @click="openEditPromoterModal(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="deletePromoter(scope.row.id)">
                                    <el-icon><Delete /></el-icon>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="d-flex justify-content-center">
                    <el-pagination :current-page="pagination.page"
                                   :page-size="pagination.pageSize"
                                   :total="filteredData.length"
                                   layout="prev, pager, next"
                                   @current-change="onPageChange" />
                </div>
            </div>
        </div>
    </div>
    <EditPromoterModal @closeEditPromoterModal="toggleModalEditPromoter" :modalEditPromoterActive="modalEditPromoterActive" :promoter="selectedPromoter" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import EditPromoterModal from '@/components/AdminComponents/SubComponents/modalEditPromoter.vue'

    export default {
        name: 'PromoterSearchPage',
        components: {
            Edit,
            Delete,
            EditPromoterModal
        },
        data() {
            return {
                modalEditPromoterActive: false,
                promoters: [],
                selectedPromoter: null,
                pagination: {
                    page: 1,
                    pageSize: 15
                },
                filters: {
                    name: '',
                }
            }
        },

        computed: {
            filteredData() {
                return this.promoters.filter(e =>
                    (!this.filters.name || e.nome.toLowerCase().includes(this.filters.name.toLowerCase())) 
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchPromoters() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetPromotersList')
                    this.promoters = response.data || []
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },

            onPageChange(page) {
                this.pagination.page = page
            },

            clearFilters() {
                this.filters = {
                    name: '',
                }
            },
            toggleModalEditPromoter() {
                this.modalEditPromoterActive = !this.modalEditPromoterActive;
                if (!this.modalEditPromoterActive) {
                    this.selectedPromoter = null;
                    this.fetchPromoters();
                }
                return this.modalEditPromoterActive;
            },
            openEditPromoterModal(id) {
                this.selectedPromoter = this.promoters.find(promoter => promoter.id === id) || null;

                if (!this.selectedPromoter) {
                    console.warn('Promoter not found for id:', id);
                    return;
                }

                this.modalEditPromoterActive = true;
            },
            deletePromoter(id) {
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover esta Promotora?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeletePromoter/${id}`);
                            this.fetchPromoters()
                            Swal.fire('Aviso!', 'Promotora apagada com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchPromoters()
        }
    }
</script>

<style scoped>
    .filter-section {
        width: 300px;
        min-width: 250px;
    }

    .table-section {
        overflow-x: auto;
        min-width: 0;
    }
</style>