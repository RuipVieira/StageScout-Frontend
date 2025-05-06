<template>
    <div class="page-content-container py-4 px-3">
        <!-- Top Card: Event Info and Tables -->
        <div class="card shadow-sm mb-4 fixed-card-top">
            <div class="card-header">
                <h5 class="mb-0">{{ event.nome }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <!-- Left: General Info -->
                    <div class="col-md-6">
                        <h6>Informação Geral</h6>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Promotora</label>
                            <div class="text-muted">{{ event.promotora }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Local</label>
                            <div class="text-muted">{{ event.local }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Datas</label>
                            <div class="text-muted">{{ event.dataInicio }} - {{ event.dataFim }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Estado</label>
                            <div class="text-muted">{{ event.estado }}</div>
                        </div>
                    </div>

                    <!-- Middle: Band Members Table -->
                    <div class="col-md-3 border-start">
                        <h6>Artistas Confirmados</h6>
                        <n-space vertical>
                            <n-data-table class="short-table" :columns="performersColumns" :data="event.performers"
                                          :pagination="{
                                               pageSize: performersPagination.pageSize,
                                               page: performersPagination.page,
                                               pageCount: Math.ceil(event.performers.length / performersPagination.pageSize),
                                               onChange: onPerformersPageChange
                                           }" />
                        </n-space>
                    </div>

                    <!-- Right: Albums Table -->
                    <div class="col-md-3 border-start">
                        <h6>Palcos</h6>
                        <n-space vertical>
                            <n-data-table class="short-table" :columns="arenasColumns" :data="event.arenas"
                                          :pagination="{
                                               pageSize: arenasPagination.pageSize,
                                               page: arenasPagination.page,
                                               pageCount: Math.ceil(event.arenas.length / arenasPagination.pageSize),
                                               onChange: onArenasPageChange
                                           }" />
                        </n-space>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="event.estado === 'Concluído'" class="card shadow-sm fixed-card">
            <div class="card-header">
                <h6 class="mb-0">Avaliações</h6>
            </div>
            <div class="card-body">
                <n-space vertical>
                    <n-data-table :columns="eventColumns"
                                  :data="event.upcomingEvents"
                                  :pagination="{
                                      pageSize: eventsPagination.pageSize,
                                      page: eventsPagination.page,
                                      pageCount: Math.ceil(event.upcomingEvents.length / eventsPagination.pageSize),
                                      onChange: onEventsPageChange
                                  }" />
                </n-space>
            </div>
        </div>

        <div v-else class="card shadow-sm fixed-card warning-card">
            <div class="card-header">
                <h6 class="mb-0">Avaliações</h6>
            </div>
            <div class="card-body">
                <div class="alert alert-warning" role="alert">
                    A seção de avaliações estará disponível apenas após a conclusão do evento. Por favor, volte mais tarde para deixar sua avaliação.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'
    import { NDataTable, NSpace } from 'naive-ui'

    export default {
        components: {
            NDataTable,
            NSpace
        },
        name: 'EventDetails',
        setup() {
            const eventsPagination = ref({
                page: 1,
                pageSize: 5
            });

            const performersPagination = ref({
                page: 1,
                pageSize: 4
            });

            const arenasPagination = ref({
                page: 1,
                pageSize: 4
            });

            const onEventsPageChange = (page) => {
                eventsPagination.value.page = page;
            };

            const onPerformersPageChange = (page) => {
                performersPagination.value.page = page;
            };

            const onArenasPageChange = (page) => {
                arenasPagination.value.page = page;
            };

            const performersColumns = [
                { title: 'Performer', key: 'groupName' },
                { title: 'Data', key: 'date' },
            ];

            const arenasColumns = [
                { title: 'Nome', key: 'name' },
            ];

            const eventColumns = [
                { title: 'Data', key: 'date' },
                { title: 'Local', key: 'location' },
                { title: 'Evento', key: 'event' }
            ];

            const event = {
                nome: 'Primavera Sound Porto 2025',
                promotora: 'Pic Nic Produções',
                local: 'Parque da Cidade - Porto, Portugal',
                dataInicio: '12/06/2025',
                dataFim: '15/06/2025',
                estado: 'A Preencher Cartaz', 
                performers: [
                    { groupName: 'Deftones', date: '13/06/2025' },
                    { groupName: 'Magdalena Bay', date: '12/06/2025' },
                    { groupName: 'Denzel Curry', date: '13/06/2025' },
                    { groupName: 'David Bruno', date: '14/06/2025' },
                    { groupName: 'Charlie XCX', date: '12/06/2025' },
                    { groupName: 'Fontaines D.C.', date: '14/06/2025' },
                ],
                arenas: [
                    { name: 'Palco Vodafone' }, { name: 'Palco Super Bock' }, { name: 'Palco Plenitude' }
                ],
                upcomingEvents: [
                    { date: '05/102025', location: 'Los Angeles - CA, EUA', event: 'The Roxy' },
                    { date: '12/10/2025', location: 'Chicago - IL, EUA', event: 'Metro' },
                    { date: '12/10/2025', location: 'Austin - TX, EUA', event: 'Mohawk' },
                    { date: '12/10/2025', location: 'New York - NY, EUA', event: 'Bowery Ballroom' },
                    { date: '12/10/2025', location: 'Austin - TX, EUA', event: 'Mohawk' },
                    { date: '12/10/2025', location: 'New York - NY, EUA', event: 'Bowery Ballroom' }
                ]
            };

            return {
                event,
                eventsPagination,
                performersPagination,
                arenasPagination,
                onEventsPageChange,
                onPerformersPageChange,
                onArenasPageChange,
                performersColumns,
                arenasColumns,
                eventColumns
            };
        }
    }
</script>

<style scoped>
    .fixed-card-top {
        width: 100%;
        height: 370px; 
        overflow: hidden;
        margin-bottom: 1rem; 
    }

        .fixed-card-top .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        .fixed-card-top .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .fixed-card {
        width: 100%;
        height: 400px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

        .fixed-card .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        .fixed-card .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .warning-card .card-body {
        padding: 1rem;
        background-color: #fff3cd;
    }

    .warning-card .alert {
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffeeba;
    }

    .n-data-table {
        font-size: 0.8rem;
    }
</style>