<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Eventos</h1>
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
                            <label for="eventVenue" class="form-label">Localização</label>
                            <input v-model="filters.venue" type="text" id="eventVenue" class="form-control" />
                        </div>
                        <div>
                            <label for="eventState" class="form-label">Estado</label>
                            <input v-model="filters.state" type="text" id="eventState" class="form-control" />
                        </div>
                        <div class="d-flex align-items-center" style="min-height: 38px;">
                            <label for="eventIsOver" class="form-label me-2 mb-0">A Decorrer</label>
                            <input v-model="filters.isFinished" type="checkbox" id="eventIsOver" class="form-check-input mt-0" />
                        </div>
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn-danger btn-cancelar me-2" @click="clearFilters">Limpar</button>
                    </div>
                </div>
            </form>

            <el-table :data="paginatedData" empty-text="Nenhum dado disponível" stripe style="width: 100%;" class="mt-4">
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
                <el-table-column align="center">
                    <template #default="scope">
                        <div v-if="paginatedData.length">
                            <el-button type="primary"
                                       size="small"
                                       class="btn-editar"
                                       circle
                                       @click="GoToEventDetails(scope.row)">
                                <el-icon><Edit /></el-icon>
                            </el-button>
                            <el-button class="btn-cancelar"
                                       type="danger"
                                       size="small"
                                       circle
                                       @click="deleteEvent(scope.row.id)">
                                <el-icon><Delete /></el-icon>
                            </el-button>
                        </div>
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
    import { Edit, Delete } from '@element-plus/icons-vue'

    export default {
        name: 'EventSearchPage',
        components: {
            Edit,
            Delete,
        },
        data() {
            return {
                events: [],
                pagination: {
                    page: 1,
                    pageSize: 6
                },
                filters: {
                    name: '',
                    venue: '',
                    state: '',
                    isFinished: false
                }
            }
        },

        computed: {
            filteredData() {
                return this.events.filter(e =>
                    (!this.filters.name || e.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.venue || e.venue.toLowerCase().includes(this.filters.venue.toLowerCase())) &&
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
                    venue: '',
                    state: '',
                    isFinished: false
                }
            },
            GoToEventDetails(row) {
                this.$router.push({ name: 'AdminEventDetails', params: { id: row.id } })
            },
            deleteEvent(id) {
                Swal.fire({
                    title: 'Aviso!',
                    text: "Tem a certeza que pretende remover este Evento?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`https://localhost:7216/api/Admin/DeleteEvent/${id}`);
                            this.fetchEvents()
                            Swal.fire('Aviso!', 'Evento apagado com sucesso.', 'success')
                        } catch (error) {
                            const message = error.response?.data?.message || 'Erro ao apagar. Tente novamente.'
                            Swal.fire('Erro', message, 'error')
                        }
                    }
                })
            }
        },

        mounted() {
            this.fetchEvents()
        }
    }
</script>


<style scoped>
</style>