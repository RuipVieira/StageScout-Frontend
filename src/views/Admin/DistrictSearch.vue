<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Localizações</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="districtName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="districtName" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="districtCountry" class="form-label">País</label>
                            <input v-model="filters.country" type="text" id="districtCountry" class="form-control" />
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
                    <el-table-column prop="pais"
                                     label="País"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.pais">{{ scope.row.pais.nome }}</span>
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
                                           @click="openEditDistrictModal(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="deleteDistrict(scope.row.id)">
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
    <EditDistrictModal @closeEditDistrictModal="toggleModalEditDistrict" :modalEditDistrictActive="modalEditDistrictActive" :district="selectedDistrict" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import EditDistrictModal from '@/components/AdminComponents/SubComponents/modalEditDistrict.vue'

    export default {
        name: 'DistrictSearchPage',
        components: {
            Edit,
            Delete,
            EditDistrictModal
        },
        data() {
            return {
                modalEditDistrictActive: false,
                districts: [],
                selectedDistrict: null,
                pagination: {
                    page: 1,
                    pageSize: 15
                },
                filters: {
                    name: '',
                    country: '',
                }
            }
        },

        computed: {
            filteredData() {
                return this.districts.filter(e =>
                    (!this.filters.name || e.nome.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.country || e.pais.nome.toLowerCase().includes(this.filters.country.toLowerCase()))
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchDistricts() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllDistricts')
                    this.districts = response.data || []
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
                    country: ''
                }
            },
            toggleModalEditDistrict() {
                this.modalEditDistrictActive = !this.modalEditDistrictActive;
                if (!this.modalEditDistrictActive) {
                    this.selectedDistrict = null;
                    this.fetchDistricts();
                }
                return this.modalEditDistrictActive;
            },
            openEditDistrictModal(id) {
                this.selectedDistrict = this.districts.find(district => district.id === id) || null;

                if (!this.selectedDistrict) {
                    console.warn('District not found for id:', id);
                    return;
                }

                this.modalEditDistrictActive = true;
            },
            deleteDistrict(id) {
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover este Distrito?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteDistrict/${id}`);
                            this.fetchDistricts()
                            Swal.fire('Aviso!', 'Distrito apagado com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchDistricts()
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