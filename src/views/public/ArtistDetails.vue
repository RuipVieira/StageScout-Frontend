<template>
    <div class="page-content-container py-4 px-3">
        <!-- Top Card: Group Info and Tables -->
        <div class="card shadow-sm mb-4 fixed-card-top">
            <div class="card-header">
                <h5 class="mb-0">{{ group.name }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <!-- Left: General Info -->
                    <div class="col-md-4">
                        <h6>Informação Geral</h6>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Género</label>
                            <div class="text-muted">{{ group.genre }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Origem</label>
                            <div class="text-muted">{{ group.country }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Ano de Fundação</label>
                            <div class="text-muted">{{ group.createdDate }}</div>
                        </div>
                    </div>

                    <!-- Middle: Band Members Table -->
                    <div class="col-md-4 border-start">
                        <h6>Membros</h6>
                        <n-space vertical>
                            <n-data-table class="short-table" :columns="memberColumns" :data="group.members"
                                          :pagination="{
                                               pageSize: membersPagination.pageSize,
                                               page: membersPagination.page,
                                               pageCount: Math.ceil(group.members.length / membersPagination.pageSize),
                                               onChange: onMembersPageChange
                                           }" />
                        </n-space>
                    </div>

                    <!-- Right: Albums Table -->
                    <div class="col-md-4 border-start">
                        <h6>Albums</h6>
                        <n-space vertical>
                            <n-data-table class="short-table" :columns="albumColumns" :data="group.albums"
                                          :pagination="{
                                               pageSize: albumsPagination.pageSize,
                                               page: albumsPagination.page,
                                               pageCount: Math.ceil(group.albums.length / albumsPagination.pageSize),
                                               onChange: onAlbumsPageChange
                                           }" />
                        </n-space>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Card: Upcoming Events -->
        <div class="card shadow-sm fixed-card">
            <div class="card-header">
                <h6 class="mb-0">Próximos Eventos</h6>
            </div>
            <div class="card-body">
                <n-space vertical>
                    <n-data-table :columns="eventColumns"
                                  :data="group.upcomingEvents"
                                  :pagination="{
                                      pageSize: eventsPagination.pageSize,
                                      page: eventsPagination.page,
                                      pageCount: Math.ceil(group.upcomingEvents.length / eventsPagination.pageSize),
                                      onChange: onEventsPageChange
                                  }" />
                </n-space>
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
        name: 'ArtistDetails',
        setup() {
            const eventsPagination = ref({
                page: 1,
                pageSize: 5
            });

            const membersPagination = ref({
                page: 1,
                pageSize: 4
            });

            const albumsPagination = ref({
                page: 1,
                pageSize: 4
            });

            const onEventsPageChange = (page) => {
                eventsPagination.value.page = page;
            };

            const onMembersPageChange = (page) => {
                membersPagination.value.page = page;
            };

            const onAlbumsPageChange = (page) => {
                albumsPagination.value.page = page;
            };

            const memberColumns = [
                { title: 'Nome', key: 'name' },
                { title: 'Nacionalidade', key: 'country' },
                { title: 'Ativo', key: 'isMember' },
            ];

            const albumColumns = [
                { title: 'Título', key: 'title' },
                { title: 'Ano Lançamento', key: 'year' }
            ];

            const eventColumns = [
                { title: 'Nome', key: 'nome' },
                { title: 'Local', key: 'location' },
                { title: 'Data de Início', key: 'startDate' },
                { title: 'Data de Fim', key: 'endDate' },
            ];

            const group = {
                name: 'Bloc Party',
                genre: 'Rock',
                country: 'Inglaterra',
                createdDate: '1999',
                members: [
                    { name: 'Kele Okereke', country: 'Inglaterra', isMember: 'Sim' },
                    { name: 'Russel Lissack', country: 'Inglaterra', isMember: 'Sim' },
                    { name: 'Louise Bartle', country: 'Inglaterra', isMember: 'Sim' },
                    { name: 'Harry Deacon', country: 'Inglaterra', isMember: 'Sim' },
                    { name: 'Gordon Moakes', country: 'Inglaterra', isMember: 'Não' },
                    { name: 'Matt Tong', country: 'Inglaterra', isMember: 'Não' },
                    { name: 'Justin Harris', country: 'EUA', isMember: 'Não' },
                ],
                albums: [
                    { title: 'Alpha Games', year: '2022' },
                    { title: 'Hymns', year: '2016' },
                    { title: 'Four', year: '2012' },
                    { title: 'Intimacy', year: '2008' },
                    { title: 'A Weekend In The City', year: '2007' },
                    { title: 'Silent Alarm', year: '2005' },
                ],
                upcomingEvents: [
                    { nome: "Primavera Sound Porto 2025", location: 'Parque da Cidade - Porto, Portugal', startDate: '12/05/2025', endDate: '15/05/2025' },
                    { nome: "NOS Alive 2025", location: 'Passeio Marítimo de Algés - Lisboa, Portugal', startDate: '10/07/2025', endDate: '13/07/2025' },
                ]
            };

            return {
                group,
                eventsPagination,
                membersPagination,
                albumsPagination,
                onEventsPageChange,
                onMembersPageChange,
                onAlbumsPageChange,
                memberColumns,
                albumColumns,
                eventColumns
            };
        }
    }
</script>

<style scoped>
    /* Fixed size for all cards */
    .fixed-card-top {
        width: 100%; /* Full width or specify custom width */
        height: 370px; /* Fixed height for all cards */
        overflow: hidden; /* Prevent content overflow from being visible */
        margin-bottom: 1rem; /* Space between cards */
    }

        /* Make the card body scrollable if content overflows */
        .fixed-card-top .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        /* Optional: Adjust the header styling for consistency */
        .fixed-card-top .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .fixed-card {
        width: 100%; /* Full width or specify custom width */
        height: 400px; /* Fixed height for all cards */
        overflow: hidden; /* Prevent content overflow from being visible */
        margin-bottom: 1rem; /* Space between cards */
    }

        /* Make the card body scrollable if content overflows */
        .fixed-card .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        /* Optional: Adjust the header styling for consistency */
        .fixed-card .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    /* Adjust the DataTable's overall look */
    .n-data-table {
        font-size: 0.8rem; /* Smaller font for compact view */
    }
</style>