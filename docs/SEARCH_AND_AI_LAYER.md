# SEARCH AND AI LAYER
# The Right Gear — Search & AI Knowledge Layer

La Search di The Right Gear è uno degli elementi centrali dell’esperienza utente e dell’identità stessa della piattaforma. The Right Gear non deve essere concepito soltanto come un database automotive da consultare attraverso pagine e menu, ma come un sistema di conoscenza interrogabile capace di accompagnare l’utente nella scoperta di auto, moto, persone, motori, organizzazioni, varianti, generazioni, identificatori tecnici e relazioni tra le diverse entità.

La Search principale costituisce il punto di accesso privilegiato all’Automotive Knowledge Graph di The Right Gear e deve evolvere attraverso due livelli complementari.

## Global Discovery Search

Il primo livello è la Global Discovery Search.

Durante la digitazione, il sistema deve riconoscere nomi, parti significative dei nomi, modelli, generazioni, varianti, persone, organizzazioni, motori, alias approvati, codici motore, codici telaio, codici piattaforma, generation code, market designation e altri identificatori pertinenti.

La finestra dei suggerimenti non deve limitarsi a restituire una sequenza piatta di risultati, ma deve mostrare immediatamente all’utente i principali percorsi di approfondimento disponibili nel Knowledge Graph.

Una ricerca come “Honda”, ad esempio, può condurre al Maker Honda, al modello Civic, a persone collegate come Soichiro Honda, a generazioni, varianti, motori e ad altre entità pertinenti.

I risultati devono essere ordinati per rilevanza ma anche sufficientemente diversificati da evitare che una singola categoria monopolizzi l’intero pannello dei suggerimenti.

Ogni entità conoscitiva ricercabile deve alimentare automaticamente l’indice attraverso i propri dati e identificatori, senza implementazioni specifiche pagina per pagina.

L’aggiunta di una nuova Person, Engine, Model o altra entità correttamente strutturata deve renderla automaticamente ricercabile secondo le regole generali della Search.

## AI Knowledge Layer

Il secondo livello è l’AI Knowledge Layer.

Una volta consolidati il Knowledge Graph, i processi di Data Sources e Validation e il patrimonio di conoscenza canonica, lo stesso punto di accesso potrà comprendere domande espresse in linguaggio naturale, come:

“How many Ferrari 328 have been produced?”

“Which Honda Civic generations used K-series engines?”

“Which designers worked on both Ferrari and Pininfarina projects?”

“Which cars shared this engine?”

“Compare the production numbers of the Ferrari 328 GTB and GTS.”

In questo caso The Right Gear non dovrà comportarsi come un generico chatbot che risponde utilizzando conoscenza libera del modello AI.

Il Layer AI dovrà interpretare la domanda, identificare le entità coinvolte, interrogare il Knowledge Graph di The Right Gear e costruire la risposta partendo dalla conoscenza disponibile, dalle assertion validate, dalla provenienza e dalle fonti.

Il principio fondamentale è:

**The AI does not replace The Right Gear knowledge. The AI interrogates, connects and explains The Right Gear knowledge.**

Quando i dati disponibili non consentono una risposta sufficientemente affidabile, il sistema deve dichiararlo esplicitamente attraverso stati come “Insufficient Data”, “Data currently under research” o equivalenti, invece di inventare informazioni mancanti.

## One Knowledge System, Two Access Modes

La Search tradizionale e il Layer AI non devono quindi essere considerati due prodotti separati.

Rappresentano due modalità di accesso allo stesso Automotive Knowledge Graph:

**Discovery Search** per trovare e navigare entità e relazioni.

**AI Knowledge Layer** per interrogare, mettere in relazione, confrontare e comprendere quelle stesse entità attraverso il linguaggio naturale.

L’architettura deve permettere nel tempo allo stesso campo Search di distinguere automaticamente un’entità o un identificatore da una domanda naturale.

Una query come “Ferrari 328” potrà attivare la Discovery Search e mostrare Model, Variant, Engines, People e altri percorsi.

Una query come “How many Ferrari 328 have been produced?” potrà invece attivare il Knowledge Answer Engine.

## User Engagement

Questo modello deve produrre anche user engagement.

Ogni risposta AI non dovrebbe rappresentare un punto terminale, ma offrire collegamenti verso le entità citate, approfondimenti correlati, confronti, relazioni tecniche, persone coinvolte, motori, altre generazioni e ulteriori domande suggerite.

In questo modo The Right Gear diventa progressivamente un ambiente di esplorazione della conoscenza automotive e non semplicemente una raccolta di schede.

## Strategic Principle

La Search e l’AI Knowledge Layer costituiscono pertanto una componente strategica fondamentale del progetto The Right Gear e devono essere progettati come parte nativa dell’Automotive Knowledge Graph fin dalle fondamenta.