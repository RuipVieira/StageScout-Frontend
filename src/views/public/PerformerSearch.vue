<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Pesquisa de Performers</h1>
        <div class="container">
            <form @submit.prevent>
                <div class="form-control p-4">
                    <h4 class="mb-3">Filtrar Pesquisa</h4>
                    <div class="d-flex flex-wrap gap-4 align-items-end">
                        <div>
                            <label for="performerName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="performerName" class="form-control" />
                        </div>
                        <div>
                            <label for="performerFoundingYear" class="form-label">Ano de Formação</label>
                            <input v-model="filters.foundingYear" type="text" id="performerFoundingYear" class="form-control" />
                        </div>
                        <div>
                            <label for="performerNation" class="form-label">Nacionalidade</label>
                            <input v-model="filters.nationality" type="text" id="performerNation" class="form-control" />
                        </div>
                        <div>
                            <label for="performerGenre" class="form-label">Género Musical</label>
                            <input v-model="filters.genre" type="text" id="performerGenre" class="form-control" />
                        </div>
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn-danger btn-cancelar me-2" @click="clearFilters">Limpar</button>
                    </div>
                </div>
            </form>

            <el-table :data="paginatedData" stripe style="width: 100%;" class="mt-4" @row-click="GoToPerformerDetails" :default-sort="{ prop: 'nome', order: 'ascending' }">
                <el-table-column prop="nome" label="Nome" width="540" />
                <el-table-column prop="generoMusical" label="Género Musical" width="250" />
                <el-table-column prop="nacionalidade" label="Nacionalidade" width="300" />
                <el-table-column prop="anoFormacao" label="Ano de Formação" width="200" />
            </el-table>

            <div class="mt-3 d-flex justify-content-center">
                <el-pagination :current-page="pagination.page"
                               :page-size="pagination.pageSize"
                               :total="filteredData.length"
                               layout="prev, pager, next"
                               @current-change="onPageChange" />
            </div>
        </div>
    </div>
</template>


<script>
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

    export default {
        name: 'PerformerSearchPage',

        data() {
            return {
                performers: [],
                pagination: {
                    page: 1,
                    pageSize: 6
                },
                filters: {
                    name: '',
                    foundingYear: '',
                    nationality: '',
                    genre:''
                }
            }
        },

        computed: {
            filteredData() {
                return this.performers.filter(e =>
                    (!this.filters.name || e.nome.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.genre || e.nome.toLowerCase().includes(this.filters.genre.toLowerCase())) &&
                    (!this.filters.foundingYear || e.anoFormacao?.toString().includes(this.filters.foundingYear)) &&
                    (!this.filters.nationality || e.nacionalidade?.toLowerCase().includes(this.filters.nationality.toLowerCase()))
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchPerformer() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Performers/GetAllPerformers')
                    this.performers = response.data || [];

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
                    foundingYear: '',
                    nationality: ''
                }
            },

            GoToPerformerDetails(row) {
                this.$router.push({ name: 'PerformerDetails', params: { id: row.id } })
            }
        },

        mounted() {
            this.fetchPerformer()
        }
    }
</script>


<style scoped>
    .custom-no-data-text {
        color: #999;
        font-size: 14px;
        text-align: center;
        padding: 20px;
    }
</style>