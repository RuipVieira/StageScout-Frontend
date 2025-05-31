<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Pesquisa de Eventos</h1>
        <div class="container">
            <form @submit.prevent>
                <div class="form-control p-4">
                    <h4 class="mb-3">Filtrar Pesquisa</h4>
                    <div class="d-flex flex-wrap gap-4 align-items-end">
                        <div>
                            <label for="eventName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="eventName" class="form-control" />
                        </div>
                        <div>
                            <label for="eventLocation" class="form-label">Localização</label>
                            <input v-model="filters.location" type="text" id="eventLocation" class="form-control" />
                        </div>
                        <div>
                            <label for="eventState" class="form-label">Estado</label>
                            <input v-model="filters.state" type="text" id="eventState" class="form-control" />
                        </div>
                        <div class="d-flex align-items-center" style="min-height: 38px;">
                            <label for="eventIsOver" class="form-label me-2 mb-0">A Decorrer</label>
                            <input v-model="filters.isOngoing" type="checkbox" id="eventIsOver" class="form-check-input mt-0" />
                        </div>
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn-danger btn-cancelar me-2" @click="clearFilters">Limpar</button>
                    </div>
                </div>
            </form>

            <el-table :data="paginatedData" empty-text="Nenhum dado disponível" stripe style="width: 100%;" class="mt-4" @row-click="GoToEventDetails">
                <el-table-column prop="name" label="Nome" />
                <el-table-column prop="venue" label="Local" />
                <el-table-column prop="startDate" label="Data de Início" />
                <el-table-column prop="endDate" label="Data de Fim" />
                <el-table-column prop="state" label="Estado" />
                <el-table-column prop="isFinished" label="A Decorrer">
                    <template #default="{ row }">
                        <span>{{ row.isFinished ? 'Não' : 'Sim' }}</span>
                    </template>
                </el-table-column>
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
        name: 'EventSearchPage',

        data() {
            return {
                events: [],
                pagination: {
                    page: 1,
                    pageSize: 6
                },
                filters: {
                    name: '',
                    location: '',
                    state: '',
                    isFinished: false
                }
            }
        },

        computed: {
            filteredData() {
                return this.events.filter(e =>
                    (!this.filters.name || e.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.location || e.venue.toLowerCase().includes(this.filters.venue.toLowerCase())) &&
                    (!this.filters.state || e.state.toLowerCase().includes(this.filters.state.toLowerCase())) &&
                    (!this.filters.isFinished || e.isFinished === false)
                )
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchEvents() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllEvents')
                    this.events = response.data || []
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
                    location: '',
                    state: '',
                    isFinished: false
                }
            },
            GoToEventDetails(row) {
                this.$router.push({ name: 'EventDetails', params: { id: row.id } })
            }
        },

        mounted() {
            this.fetchEvents()
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