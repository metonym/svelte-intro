<script>
  export let urls = [];
  export let github_repo = "#";

  import {
    Link,
    Grid,
    Row,
    Column,
    Accordion,
    AccordionItem,
    Tag,
    Loading,
    UnorderedList,
    ListItem,
    Search,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";

  let results = [];
  let loading = false;
  let value = "";

  $: {
    results = results.map((result) => {
      const entitiesByType = {};

      result.entities.forEach((entity) => {
        if (entity.type in entitiesByType) {
          entitiesByType[entity.type] = [
            ...entitiesByType[entity.type],
            entity,
          ];
        } else {
          entitiesByType[entity.type] = [entity];
        }
      });

      return {
        ...result,
        entitiesByType,
      };
    });
  }

  function fetchWatsonNLU() {
    results = [];
    loading = true;

    const api_requests = urls.map((url) =>
      fetch("/api/watson-nlu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          features: {
            metadata: {},
            concepts: { emotion: true, sentiment: true, limit: 3 },
            keywords: { emotion: true, sentiment: true, limit: 6 },
            entities: { emotion: true, sentiment: true, limit: 9 },
          },
        }),
      })
    );

    Promise.all(api_requests).then(async (api_responses) => {
      for (const response of api_responses) {
        const data = await response.json();
        results = [...results, data];
      }

      loading = false;
    });
  }

  onMount(fetchWatsonNLU);
</script>

<style>
  :global(.bx--row) {
    margin-top: 1.5rem;
    margin-bottom: 3.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  img {
    width: 100%;
  }
</style>

<Grid>
  <Row>
    <Column lg={4} md={4}>
      <p>
        Learn core Svelte concepts by interacting with Watson Natural Language
        Understanding APIs.
      </p>
      <p>
        <Link href={github_repo} target="_blank">Code on GitHub</Link>
      </p>
    </Column>
  </Row>

  <Row>
    <Column lg={{ span: 8, offset: 4 }}>
      <Search placeholder="Filter concepts, entities, keywords..." bind:value />
    </Column>
  </Row>

  {#if loading}
    <Row>
      <Column lg={{ span: 8, offset: 4 }}>
        <Loading small withOverlay={false} />
      </Column>
    </Row>
  {/if}

  {#if !loading}
    {#each results as result}
      <Row>
        <Column lg={4} md={4}>
          <div>
            <!-- Svelte will issue an a11y warning if the `alt` attribute is missing -->
            <img src={result.metadata.image} alt={result.metadata.title} />
          </div>
          <div style="margin-top: 1rem; margin-bottom: .5rem;">
            <Link href={result.retrieved_url} target="_blank">Article URL</Link>
            <time>{result.metadata.publication_date}</time>
          </div>
          <h2 style="margin-bottom: 1rem;">{result.metadata.title}</h2>
          <div>
            {result.metadata.authors.map((author) => author.name).join(', ')}
          </div>
        </Column>
        <Column>
          <Accordion>
            <AccordionItem title="Concepts ({result.concepts.length})" open>
              <UnorderedList>
                {#each result.concepts as concept}
                  <ListItem style="display: flex; align-items: center">
                    <Tag type="blue" disabled={!concept.text.includes(value)}>
                      {concept.text}
                    </Tag>
                    (
                    <Link href={concept.dbpedia_resource}>
                      DBPedia Resource
                    </Link>
                    )
                  </ListItem>
                {/each}
              </UnorderedList>
            </AccordionItem>
            <AccordionItem title="Entities ({result.entities.length})" open>
              {#each Object.keys(result.entitiesByType) as entityType}
                <div>
                  {entityType}:
                  {#each result.entitiesByType[entityType] as entity}
                    <Tag type="teal" disabled={!entity.text.includes(value)}>
                      {entity.text}
                    </Tag>
                  {/each}
                </div>
              {/each}
            </AccordionItem>
            <AccordionItem title="Keywords ({result.keywords.length})" open>
              {#each result.keywords as keyword}
                <Tag type="purple" disabled={!keyword.text.includes(value)}>
                  {keyword.text}&nbsp;
                  <strong>({keyword.sentiment.label})</strong>
                </Tag>
              {/each}
            </AccordionItem>
          </Accordion>
        </Column>
      </Row>
    {/each}
  {/if}
</Grid>
