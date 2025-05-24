<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Albums</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="albumName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="albumName" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="albumYear" class="form-label">Ano de Lançamento</label>
                            <input v-model="filters.year" type="text" id="albumYear" class="form-control" />
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
                                     width="900"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.nome">{{ scope.row.nome }}</span>
                            <span v-else-if="!paginatedData.length" class="text-muted">Nenhum dado disponível</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="anoLancamento"
                                     label="Ano de Lançamento"
                                     width="200"
                                     align="center"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.anoLancamento">{{ scope.row.anoLancamento }}</span>
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
                                           @click="openEditAlbumModal(scope.row.id)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="deleteAlbum(scope.row.id)">
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
    <EditAlbumModal @closeEditAlbumModal="toggleModalEditAlbum" :modalEditAlbumActive="modalEditAlbumActive" :album="selectedAlbum" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import EditAlbumModal from '@/components/AdminComponents/SubComponents/modalEditAlbum.vue'

    export default {
        name: 'AlbumSearchPage',
        components: {
            Edit,
            Delete,
            EditAlbumModal
        },
        data() {
            return {
                modalEditAlbumActive: false,
                albums: [],
                selectedAlbum: null, 
                pagination: {
                    page: 1,
                    pageSize: 15
                },
                filters: {
                    name: '',
                    year: '',
                }
            }
        },

        computed: {
            filteredData() {
                return this.albums.filter(e =>
                    (!this.filters.name || e.nome.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.year || e.anoLancamento.toString().includes(this.filters.year))
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchAlbums() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllAlbums')
                    this.albums = response.data || []
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
            toggleModalEditAlbum() {
                this.modalEditAlbumActive = !this.modalEditAlbumActive;
                if (!this.modalEditAlbumActive) {
                    this.selectedAlbum = null;
                    this.fetchAlbums();
                }
                return this.modalEditAlbumActive;
            },
            openEditAlbumModal(id) {
                this.selectedAlbum = this.albums.find(album => album.id === id) || null;

                if (!this.selectedAlbum) {
                    console.warn('Album not found for id:', id);
                    return;
                }

                this.modalEditAlbumActive = true;
            },
            deleteAlbum(id) {
                console.log(id)
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover este album?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteAlbum/${id}`);
                            this.fetchAlbums()
                            Swal.fire('Aviso!', 'Album apagado com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchAlbums()
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