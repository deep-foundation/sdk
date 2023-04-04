const pathToWhere = (start, ...path) => {
  const pckg = typeof (start) === 'string' ? { type_id: { _eq: 2 }, string: { value: { _eq: start } } } : { id: { _eq: start } };
  let where = pckg;
  for (let p = 0; p < path.length; p++) {
    const item = path[p];
    if (typeof (item) !== 'boolean') {
      const nextWhere = { in: { type_id: { _eq: 3 }, string: { value: { _eq: item } }, from: where } };
      where = nextWhere;
    }
  }
  return where;
}

export const getLinkId = async (start, ...path) => {
  const containWhere = pathToWhere(start, ...path);

  const deepquery2 = {
    "query": `query deepid($where:links_bool_exp!){links(where:$where){id}}`,
    variables: { where: containWhere }
  }

  const response = await fetch("http://127.0.0.1:3006/gql", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzc2In0sImlhdCI6MTY3OTkzNTMyOH0.LmDNulSTSSrm7gKno3E1sBLAhz5TKi-SFBl9oFNfs-k"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(deepquery2), // body data type must match "Content-Type" header
  });
  const result = await response.json()

  console.log(start, ...path)
  console.log(deepquery2.query);
  console.log(result);
  return result.data.links[0].id
}