<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Géneros Musicais</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="genreName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="genreName" class="form-control" />
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

                    <el-table-column prop="performersCount"
                                     label="Contagem Performers"
                                     width="200"
                                     align="center"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.performersCount">{{ scope.row.performersCount }}</span>
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
                                           @click="openEditMusicGenreModal(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="deleteMusicGenre(scope.row.id)">
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
    <EditMusicGenreModal @closeEditMusicGenreModal="toggleModalEditMusicGenre" :modalEditMusicGenreActive="modalEditMusicGenreActive" :genre="selectedMusicGenre" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import EditMusicGenreModal from '@/components/AdminComponents/SubComponents/modalEditMusicGenre.vue'

    export default {
        name: 'MusicGenreSearchPage',
        components: {
            Edit,
            Delete,
            EditMusicGenreModal
        },
        data() {
            return {
                modalEditMusicGenreActive: false,
                genres: [],
                selectedMusicGenre: null,
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
                return this.genres.filter(e =>
                    (!this.filters.name || e.name.toLowerCase().includes(this.filters.name.toLowerCase()))
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchGenres() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllMusicGenres')
                    this.genres = response.data || []
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
                    year: '',
                }
            },
            toggleModalEditMusicGenre() {
                this.modalEditMusicGenreActive = !this.modalEditMusicGenreActive;
                if (!this.modalEditMusicGenreActive) {
                    this.selectedMusicGenre = null;
                    this.fetchGenres();
                }
                return this.modalEditMusicGenreActive;
            },
            openEditMusicGenreModal(id) {
                this.selectedMusicGenre = this.genres.find(genre => genre.id === id) || null;

                if (!this.selectedMusicGenre) {
                    console.warn('MusicGenre not found for id:', id);
                    return;
                }

                this.modalEditMusicGenreActive = true;
            },
            deleteMusicGenre(id) {
                console.log(id)
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover este Género?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteGenre/${id}`);
                            this.fetchGenres()
                            Swal.fire('Aviso!', 'Género Musical apagado com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchGenres()
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