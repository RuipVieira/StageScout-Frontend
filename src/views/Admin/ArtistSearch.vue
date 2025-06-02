<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Artistas</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="artistName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="artistName" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="artistNationality" class="form-label">Nacionalidade</label>
                            <input v-model="filters.nationality" type="text" id="artistNationality" class="form-control" />
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
                    <el-table-column prop="name"
                                     label="Nome"
                                     width="900"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.name">{{ scope.row.name }}</span>
                            <span v-else-if="!paginatedData.length" class="text-muted">Nenhum dado disponível</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="nationality.name"
                                     label="Nacionalidade"
                                     width="200"
                                     sortable>
                    </el-table-column>

                    <el-table-column width="150"
                                     align="center">
                        <template #default="scope">
                            <div v-if="paginatedData.length">
                                <el-button type="primary"
                                           size="small"
                                           class="btn-editar"
                                           circle
                                           @click="openEditArtistModal(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="deleteArtist(scope.row.id)">
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
    <EditArtistModal @closeEditArtistModal="toggleModalEditArtist" :modalEditArtistActive="modalEditArtistActive" :artist="selectedArtist" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import EditArtistModal from '@/components/AdminComponents/SubComponents/modalEditArtist.vue'

    export default {
        name: 'artistSearchPage',
        components: {
            Edit,
            Delete,
            EditArtistModal
        },
        data() {
            return {
                modalEditArtistActive: false,
                artists: [],
                selectedArtist: null,
                pagination: {
                    page: 1,
                    pageSize: 15
                },
                filters: {
                    name: '',
                    nationality: '',
                }
            }
        },

        computed: {
            filteredData() {
                return this.artists.filter(e =>
                    (!this.filters.name || e.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.nationality || e.nationality?.name?.toLowerCase().includes(this.filters.nationality.toLowerCase()))
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchArtists() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllArtists')
                    this.artists = response.data || []
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
                    nationality: '',
                }
            },
            toggleModalEditArtist() {
                this.modalEditArtistActive = !this.modalEditArtistActive;
                if (!this.modalEditArtistActive) {
                    this.selectedArtist = null;
                    this.fetchArtists();
                }
                return this.modalEditArtistActive;
            },
            openEditArtistModal(id) {
                this.selectedArtist = this.artists.find(artist => artist.id === id) || null;
                this.modalEditArtistActive = true;
            },
            deleteArtist(id) {
                console.log(id)
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover este Artista?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteArtist/${id}`);
                            this.fetchArtists()
                            Swal.fire('Aviso!', 'Artista apagado com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchArtists()
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