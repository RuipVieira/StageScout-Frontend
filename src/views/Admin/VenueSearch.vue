<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Localizações</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="venueName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="venueName" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="venueNationality" class="form-label">País</label>
                            <input v-model="filters.country" type="text" id="venueNationality" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="venueDistrict" class="form-label">Distrito</label>
                            <input v-model="filters.district" type="text" id="venueDistrict" class="form-control" />
                        </div>
                        <button type="button" class="btn btn-danger btn-cancelar mt-2" @click="clearFilters">Limpar</button>
                    </div>
                </form>
            </div>

            <div class="table-section overflow-auto">
                <el-table v-if="paginatedData.length"
                          :data="paginatedData"
                          stripe
                          style="width: 100%; min-width: 1200px;"
                          class="mb-4">
                    <el-table-column prop="name"
                                     label="Nome"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.name">{{ scope.row.name }}</span>
                            <span v-else-if="!paginatedData.length" class="text-muted">Nenhum dado disponível</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="country"
                                     label="País"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.country.name">{{ scope.row.country.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="district"
                                     label="Distrito"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.district.name">{{ scope.row.district.name }}</span>
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
                                           @click="openEditVenueModal(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="deleteVenue(scope.row.id)">
                                    <el-icon><Delete /></el-icon>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-else class="text-center text-muted my-4">
                    Nenhum dado disponível
                </div>

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
    <EditVenueModal @closeEditVenueModal="toggleModalEditVenue" :modalEditVenueActive="modalEditVenueActive" :venue="selectedVenue" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import EditVenueModal from '@/components/AdminComponents/SubComponents/modalEditVenue.vue'

    export default {
        name: 'VenueSearchPage',
        components: {
            Edit,
            Delete,
            EditVenueModal
        },
        data() {
            return {
                modalEditVenueActive: false,
                venues: [],
                selectedVenue: null,
                pagination: {
                    page: 1,
                    pageSize: 15
                },
                filters: {
                    name: '',
                    country: '',
                    district: '',
                }
            }
        },

        computed: {
            filteredData() {
                return this.venues.filter(e =>
                    (!this.filters.name || e.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.country || e.country?.name?.toLowerCase().includes(this.filters.country.toLowerCase())) &&
                    (!this.filters.district || e.district?.name?.toLowerCase().includes(this.filters.district.toLowerCase()))
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchVenues() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllVenues')
                    this.venues = response.data || []
                    console.log(this.venues)
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
                    country: '',
                    district: ''
                }
            },
            toggleModalEditVenue() {
                this.modalEditVenueActive = !this.modalEditVenueActive;
                if (!this.modalEditVenueActive) {
                    this.selectedVenue = null;
                    this.fetchVenues();
                }
                return this.modalEditVenueActive;
            },
            openEditVenueModal(id) {
                this.selectedVenue = this.venues.find(venue => venue.id === id) || null;

                if (!this.selectedVenue) {
                    console.warn('Venue not found for id:', id);
                    return;
                }

                this.modalEditVenueActive = true;
            },
            deleteVenue(id) {
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover esta Localização?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteVenue/${id}`);
                            this.fetchVenues()
                            Swal.fire('Aviso!', 'Localização apagada com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchVenues()
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