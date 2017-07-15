%%
%% mob - stress test the fanboy-http API
%%

-module(mob).

-export([start/0, stop/0]).

start() ->
  {ok, _} = application:ensure_all_started(gun),
  application:start(?MODULE).

stop() ->
  ok = application:stop(?MODULE),
  application:stop(gun).
