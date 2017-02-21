-module(mob_sup).
-behaviour(supervisor).

-export([start_link/0]).
-export([init/1]).

-define(NAME, ?MODULE).

start_link() ->
	supervisor:start_link({local, ?NAME}, ?MODULE, []).

server_spec() -> #{
  id => mob_queries,
  start => {mob_queries, start_link, []},
  restart => permanent,
  shutdown => 5000,
  type => worker,
  modules => [mob_queries]
}.

client_spec(Host, Port, Id) -> #{
  id => Id,
  start => {mob_request, start_link, [{Host, Port}]},
  restart => permanent,
  shutdown => 5000,
  type => worker,
  modules => {mob_request]
}.

client_specs() ->
  {ok, Host} = application:get_env(mob, host),
  {ok, Port} = application:get_env(mob, port),
  {ok, M} = application:get_env(mob, connections),
  Clients = [client_spec(Host, Port, N) || N <- lists:seq(1, M)],
  [server_spec()|Clients].

sup_flags() -> #{
  strategy => rest_for_one,
  intensity => 10,
  period => 5
}.

init([]) ->
  {ok, {sup_flags(), client_specs()}}.
