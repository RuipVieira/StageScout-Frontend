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
            <n-space vertical>
                <n-data-table :columns="columns"
                              :data="events"
                              :pagination="{
                                pageSize: 10,
                                showSizePicker: false,
                                page: pagination.page,
                                pageCount: Math.ceil(events.length / pagination.pageSize),
                                onChange: onPageChange
                              }" />
            </n-space>
        </div>
    </div>
</template>

<script>
    import { NDataTable, NSpace } from 'naive-ui';

    export default {
        components: {
            NDataTable,
            NSpace,
        },
        data() {
            return {
                columns: [
                    { title: '#', key: 'id' },
                    { title: 'Nome', key: 'nome' },
                    { title: 'Email', key: 'email' },
                    { title: 'Status', key: 'status' },
                ],
                events: [
                    { id: 1, nome: 'Ana Silva', email: 'ana@email.com', status: 'Ativo' },
                    { id: 2, nome: 'João Costa', email: 'joao@email.com', status: 'Inativo' },
                    { id: 3, nome: 'Pedro Gomes', email: 'pedro@email.com', status: 'Ativo' },
                    { id: 4, nome: 'Maria Oliveira', email: 'maria@email.com', status: 'Inativo' },
                    { id: 5, nome: 'Carlos Pereira', email: 'carlos@email.com', status: 'Ativo' },
                    { id: 6, nome: 'Ana Costa', email: 'ana2@email.com', status: 'Ativo' },
                    { id: 7, nome: 'Joana Rocha', email: 'joana@email.com', status: 'Ativo' },
                    { id: 8, nome: 'Paulo Silva', email: 'paulo@email.com', status: 'Inativo' },
                    { id: 9, nome: 'Cláudia Martins', email: 'claudia@email.com', status: 'Ativo' },
                    { id: 10, nome: 'Ricardo Souza', email: 'ricardo@email.com', status: 'Ativo' },
                    { id: 11, nome: 'Laura Costa', email: 'laura@email.com', status: 'Inativo' },
                ],
                pagination: {
                    page: 1,
                    pageSize: 10, // Set page size to 5 items per page
                },
                paginationConfig: {
                    prevText: 'Anterior',
                    nextText: 'Próximo',
                    firstText: 'Primeiro',
                    lastText: 'Último',
                    showingText: 'A mostrar',
                    ofText: 'de',
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