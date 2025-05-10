<template>
    <div class="page-content-container">
        <div class="about-container" v-if="!authState.isLoggedIn">
            <h1 class="mb-3 text-center">StageScout</h1>
            <p class="lead">A StageScout é uma ferramenta de aglomeração de informação, promoção de eventos e levantamento de opiniões, desenvolvida como projeto final de licenciatura de Engenharia Informática, obtido na universidade ISTEC Porto.</p>
            <p class="lead">
                As principais funções da StageScout são:<br>
                ● Atuar como ponto de encontro de toda a informação essencial dos festivais e eventos, a serem realizados em todo o país.<br>
                ● Plataforma de notícias e atualizações dos conteúdos dos eventos e festivais de música.<br>
                ● Ferramenta de levantamento de opiniões e avaliações, obtidas por influência direta dos clientes/utilizadores.<br>
                ● Plataforma de gestão de informação e levantamento de dados estatísticos, para uso por parte das promotoras e organizadoras de eventos e festivais.<br>
            </p>
            <p class="lead">
                A plataforma é intuitiva e responsiva, os seus utilizadores podem pesquisar facilmente pelos eventos e festivais que mais lhes interessam, criar a sua própria conta de utilizador para guardar uma lista de eventos para ainda mais fácil acesso e, também, inserir o seu feedback e avaliação dos eventos que presenciou.<br>
            </p>
            <p class="lead">
                Para obter acesso às principais funcionalidades da plataforma, é necessário efectuar o registo de uma conta ou fazer login com uma conta existente.<br>
            </p>
        </div>
        <div class="about-container" v-if="authState.isLoggedIn">
            <h1 class="mb-3 text-center">StageScout</h1>
            <p class="lead">
                Obrigado por utilizar a plataforma StageScout, hub de eventos musicais. <br>Se ainda não o fez, por favor configure as informações principais do seu perfil para poder submeter as suas avaliações e feedback dos eventos que presenciou.<br>
            </p>
        </div>
        <div class="card shadow-sm mb-4 fixed-card-top" v-if="authState.isLoggedIn">
            <div class="card-header">
                <h5 class="mb-0">Próximos Eventos</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Eventos Seguidos</h6>
                        <n-space vertical>
                            <n-data-table :onRowClick="GoToEventDetails" class="short-table" :columns="eventsColumns" :data="followedEvents"
                                          :pagination="{
                               pageSize: eventsPagination.pageSize,
                               page: eventsPagination.page,
                               pageCount: Math.ceil(followedEvents.length / eventsPagination.pageSize),
                               onChange: onEventsPageChange
                           }" />
                        </n-space>
                    </div>

                    <!-- Right: Albums Table -->
                    <div class="col-md-6">
                        <h6>Artistas Seguidos</h6>
                        <n-space vertical>
                            <n-data-table :onRowClick="GoToArtistDetails" class="short-table" :columns="artistsColumns" :data="followedArtists"
                                          :pagination="{
                               pageSize: artistsPagination.pageSize,
                               page: artistsPagination.page,
                               pageCount: Math.ceil(followedArtists.length / artistsPagination.pageSize),
                               onChange: onArtistsPageChange
                           }" />
                        </n-space>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { authState } from '../../auth';
    import Swal from 'sweetalert2';
    import { ref, watch } from 'vue'
    import { NDataTable, NSpace } from 'naive-ui'
    import { useRouter } from 'vue-router'
    import axios from 'axios';

    export default {
        name: 'HeaderComponent',
        components: {
            NDataTable,
            NSpace
        },
        setup() {
            const eventsPagination = ref({
                page: 1,
                pageSize: 6
            });

            const artistsPagination = ref({
                page: 1,
                pageSize: 6
            });

            const onEventsPageChange = (page) => {
                eventsPagination.value.page = page;
            };

            const onArtistsPageChange = (page) => {
                artistsPagination.value.page = page;
            };

            const artistsColumns = [
                { title: 'Id', key: 'Id' },
                { title: 'Performer', key: 'NomePerformer' },
                { title: 'Evento', key: 'NomeEvento' },
                { title: 'Palco', key: 'Palco' },
                { title: 'Data', key: 'Data' },
                { title: 'Hora', key: 'Hora' },
            ];

            const eventsColumns = [
                { title: 'Id', key: 'Id' },
                { title: 'Nome', key: 'Nome' },
                { title: 'Local', key: 'Local' },
                { title: 'Data de Início', key: 'DataInicio' },
                { title: 'Data de Fim', key: 'DataFim' },
                { title: 'Estado', key: 'Estado' },
            ];

            return {
                eventsPagination,
                artistsPagination,
                onEventsPageChange,
                onArtistsPageChange,
                artistsColumns,
                eventsColumns,
                authState,
            };
        },

        data() {
            return {
                followedEvents: [],
                followedArtists: [],
            };
        },

        watch: {
            'authState.isLoggedIn'() {
                if (authState.isLoggedIn) {
                    this.GetFollowedEntities();
                }
            }
        },

        mounted() {
            if (authState.isLoggedIn) {
                this.GetFollowedEntities();
            }
        },

        methods: {
            async GetFollowedEntities() {
                try {
                    const response = await axios.get('https://localhost:7216/api/home/GetFollowedEntities', {
                        params: {
                            profileId: localStorage.getItem('profileId')
                        }
                    });

                    this.followedEvents = response.data.FollowedEventsList;
                    this.followedArtists = response.data.FollowedPerformerEventsList;
                } catch (error) {
                    console.error('Error fetching followed entities:', error);
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            GoToEventDetails(rowData, rowIndex) {
                console.log('Clicked row:', rowData) // debug log
                router.push({ name: 'EventDetails', params: { id: rowData.id } })
            },

            GoToArtistDetails(rowData, rowIndex) {
                router.push({ name: 'ArtistDetails', params: { id: rowData.id } })
            }
        }
    }
</script>

<style>
    .about-container {
        margin: 2%;
    }

    .short-table .n-data-table .n-data-table-tr {
        cursor: pointer !important;
    }
</style>