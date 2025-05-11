<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">StageScout - Search</h1>
        <div class="container">
            <form>
                <div class="form-control p-4">
                    <h4 class="mb-3">Filtrar Pesquisa</h4>
                    <div class="d-flex flex-wrap gap-4 align-items-end">
                        <div>
                            <label for="eventName" class="form-label">Nome</label>
                            <input type="text" id="eventName" name="eventName" class="form-control">
                        </div>
                        <div>
                            <label for="eventLocation" class="form-label">Localização</label>
                            <input type="text" id="eventLocation" name="eventLocation" class="form-control">
                        </div>
                        <div>
                            <label for="eventState" class="form-label">Estado</label>
                            <input type="text" id="eventState" name="eventState" class="form-control">
                        </div>
                        <div>
                            <label for="eventPerformer" class="form-label">Artista</label>
                            <input type="text" id="eventPerformer" name="eventPerformer" class="form-control">
                        </div>
                        <!-- Checkbox aligned with other fields, label next to input -->
                        <div class="d-flex align-items-center" style="min-height: 38px;">
                            <label for="eventIsOver" class="form-label me-2 mb-0">A Decorrer</label>
                            <input type="checkbox" id="eventIsOver" name="eventIsOver" class="form-check-input mt-0">
                        </div>
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn-danger btn-cancelar me-2">Limpar</button>
                        <button type="submit" class="btn btn-primary">Confirmar</button>
                    </div>
                </div>
            </form>

            <!-- Element Plus Table -->
            <el-table :data="paginatedData" stripe style="width: 100%">
                <el-table-column prop="nome" label="Nome"></el-table-column>
                <el-table-column prop="location" label="Local"></el-table-column>
                <el-table-column prop="startDate" label="Data de Início"></el-table-column>
                <el-table-column prop="endDate" label="Data de Conclusão"></el-table-column>
            </el-table>

            <!-- Element Plus Pagination -->
            <el-pagination :current-page="pagination.page"
                           :page-size="pagination.pageSize"
                           :total="events.length"
                           @current-change="onPageChange"
                           layout="prev, pager, next, jumper, ->, total">
            </el-pagination>
        </div>
    </div>
</template>


<script>
    import { ref, computed } from 'vue';
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'; // Import Element Plus components

    export default {
        components: {
            ElTable,
            ElTableColumn,
            ElPagination,
        },
        data() {
            return {
                events: [
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' }
                ],
                pagination: {
                    page: 1,
                    pageSize: 10, // Set page size to 10 items per page
                },
            };
        },
        computed: {
            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize;
                const end = start + this.pagination.pageSize;
                return this.events.slice(start, end);
            }
        },
        methods: {
            onPageChange(newPage) {
                this.pagination.page = newPage;
            },
        },
    };
</script>


<style scoped>
    .custom-no-data-text {
        color: #999;
        font-size: 14px;
        text-align: center;
        padding: 20px;
    }
</style>