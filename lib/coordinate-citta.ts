/**
 * Il centro delle città della directory (gradi decimali, WGS84), per la
 * mappa nazionale e come punto di partenza della ricerca delle posizioni.
 * Una città nuova in lib/feste.ts = una riga qui (la batteria admin controlla).
 */
export const CENTRO_CITTA: Record<string, [number, number]> = {
  milano: [45.4642, 9.19], roma: [41.9028, 12.4964], napoli: [40.8518, 14.2681], torino: [45.0703, 7.6869],
  palermo: [38.1157, 13.3615], genova: [44.4056, 8.9463], bologna: [44.4949, 11.3426], firenze: [43.7696, 11.2558],
  bari: [41.1171, 16.8719], catania: [37.5079, 15.083], verona: [45.4384, 10.9916], venezia: [45.4408, 12.3155],
  messina: [38.1938, 15.554], padova: [45.4064, 11.8768], trieste: [45.6495, 13.7768], brescia: [45.5416, 10.2118],
  taranto: [40.4644, 17.247], prato: [43.8777, 11.1022], "reggio-calabria": [38.1113, 15.6475], modena: [44.6471, 10.9252],
  parma: [44.8015, 10.3279], "reggio-emilia": [44.6989, 10.6297], perugia: [43.1107, 12.3908], livorno: [43.5485, 10.3106],
  ravenna: [44.4184, 12.2035], cagliari: [39.2238, 9.1217], foggia: [41.4622, 15.5446], rimini: [44.0678, 12.5695],
  salerno: [40.6824, 14.7681], ferrara: [44.8381, 11.6198], latina: [41.4676, 12.9037], monza: [45.5845, 9.2744],
  bergamo: [45.6983, 9.6773], trento: [46.0748, 11.1217], vicenza: [45.5455, 11.5354], bolzano: [46.4983, 11.3548],
  piacenza: [45.0526, 9.693], novara: [45.4469, 8.622], arezzo: [43.4633, 11.8796], udine: [46.0711, 13.2346],
  cesena: [44.1391, 12.2431], lecce: [40.3515, 18.175], treviso: [45.6669, 12.243], como: [45.8081, 9.0852], varese: [45.8206, 8.8251], lucca: [43.8429, 10.5027], grosseto: [42.7635, 11.1124], siracusa: [37.0755, 15.2866], cremona: [45.1332, 10.0227], cosenza: [39.2983, 16.2537], caserta: [41.0745, 14.3323], pozzuoli: [40.8227, 14.1219], viterbo: [42.4174, 12.1047], trapani: [38.0176, 12.5365], savona: [44.3091, 8.4772],
};
