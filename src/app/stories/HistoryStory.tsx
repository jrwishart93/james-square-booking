import Image from 'next/image';

/** A short history of Dalry and how James Square came to be. */
export default function HistoryStory() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Dalry before urban development</h3>
        <p>
          Until the late eighteenth century, Dalry remained largely rural and lay beyond Edinburgh’s
          formal town boundary. The area consisted primarily of agricultural land associated with
          Dalry House, a seventeenth-century estate that stood as the principal settlement in the
          district. Although Dalry sat on the western approach to the city and was crossed by routes
          linking Edinburgh with the west, it remained sparsely developed for much of this period.
        </p>
        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
          <Image
            src="/images/area/dalry-house.jpeg"
            alt="Dalry House and surrounding rural landscape"
            width={1200}
            height={800}
            sizes="(min-width:1024px) 800px, 100vw"
            className="h-auto w-full object-contain"
          />
        </figure>
        <p>
          This rural character began to change decisively in the early nineteenth century as
          Edinburgh expanded westward. The transformation of Dalry was driven by improvements in
          transport infrastructure and the rapid growth of industrial employment across the
          western edge of the city.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Railways and industrial expansion</h3>
        <p>
          The opening of Haymarket Station in 1842 marked a fundamental shift in Dalry’s
          development. Haymarket quickly became Edinburgh’s second major railway hub, surrounded by
          extensive sidings, goods yards, and branch lines spreading west and south. The arrival of
          the railway brought industry with it, reshaping the area both physically and socially.
        </p>
        <p>
          Large numbers of skilled and semi-skilled workers were employed by the Caledonian Railway,
          while nearby industries such as brewing, rubber manufacturing, and whisky distilling
          expanded to take advantage of rail access. The Caledonian Distillery, which opened in
          1885, became one of the most prominent industrial landmarks in the district and a
          defining feature of Dalry’s western skyline.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
            <Image
              src="/images/area/Caledonian_Distillery.jpg"
              alt="Caledonian Distillery exterior"
              width={1200}
              height={800}
              sizes="(min-width:1024px) 800px, 100vw"
              className="h-auto w-full object-contain"
            />
          </figure>
          <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
            <Image
              src="/images/area/caledonian-distillery-from-above.jpg"
              alt="Aerial view of the Caledonian Distillery"
              width={1200}
              height={800}
              sizes="(min-width:1024px) 800px, 100vw"
              className="h-auto w-full object-contain"
            />
          </figure>
        </div>
        <p>
          This concentration of employment created immediate demand for housing within walking
          distance of workplaces, prompting rapid residential development across the surrounding
          streets.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Victorian housing and Caledonian Crescent</h3>
        <p>
          From the 1860s onward, Dalry was systematically urbanised. Landowners and speculative
          builders laid out new streets of sandstone tenements designed to accommodate the better-paid
          segment of the working population, particularly those employed by the railways and nearby
          industries. Caledonian Crescent formed part of this late-Victorian expansion and was
          developed primarily during the 1870s and 1880s.
        </p>
        <p>
          The street was characterised by substantial stone tenements arranged in a regular and
          planned layout, reflecting a deliberate approach to urban development rather than piecemeal
          growth. Its proximity to Dalry Road, Haymarket Station, and major employers made it a
          practical and desirable location. While Caledonian Crescent was not conceived as elite
          housing, it was solid, respectable, and well situated within the expanding city.
        </p>
        <p>
          The establishment of supporting community infrastructure reinforced Dalry’s status as a
          settled neighbourhood. The opening of the Dalry Public Baths in 1897 provided a significant
          civic amenity and marked the transition of the area from an industrial fringe to a fully
          established urban district.
        </p>
        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
          <Image
            src="/images/area/dalry-public-baths.png"
            alt="Dalry Public Baths building"
            width={1200}
            height={800}
            sizes="(min-width:1024px) 800px, 100vw"
            className="h-auto w-full object-contain"
          />
        </figure>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Dalry Road as a transport and commercial spine</h3>
        <p>
          Dalry Road functioned as the main artery through the district, carrying horse trams, heavy
          pedestrian traffic, and a dense mix of shops, schools, churches, and public houses. The road
          linked residential streets such as Caledonian Crescent to places of work, commerce, and
          worship, forming the social and economic backbone of the area.
        </p>
        <p>
          The opening of a local railway station on Dalry Road in 1900 further strengthened its
          importance, although the station later closed in 1962. By the early twentieth century, Dalry
          had been fully absorbed into Edinburgh’s urban fabric, with little remaining trace of its
          earlier rural character.
        </p>
        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
          <Image
            src="/images/area/clear-dalry-primary.png"
            alt="Dalry Road and surrounding district"
            width={1200}
            height={800}
            sizes="(min-width:1024px) 800px, 100vw"
            className="h-auto w-full object-contain"
          />
        </figure>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Post-war decline and land clearance</h3>
        <p>
          Following the Second World War, Dalry entered a period of transition. Rail use declined,
          heavy industry contracted, and large areas of railway land became redundant. This was
          particularly evident south of Dalry Road and west of Haymarket, where extensive sidings and
          yards were gradually abandoned.
        </p>
        <p>
          By the 1960s, significant tracts of land had become derelict or underused, creating physical
          gaps within the urban fabric and weakening connections between long-established residential
          streets.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">The West Approach Road and physical separation</h3>
        <p>
          During the late 1960s and early 1970s, Edinburgh adopted a modern traffic strategy focused on
          improving vehicular access to the city centre. This resulted in the construction of the West
          Approach Road, much of which followed former railway alignments.
        </p>
        <p>
          The impact on Dalry was profound. Large areas of former rail land were cleared, established
          pedestrian routes were severed, and parts of the neighbourhood became enclosed by major
          infrastructure. While the new road improved access to the city centre, it also left behind
          isolated parcels of land adjacent to streets such as Caledonian Crescent.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
            <Image
              src="/images/area/clear - west approach road.JPG"
              alt="Construction of the West Approach Road"
              width={1200}
              height={800}
              sizes="(min-width:1024px) 800px, 100vw"
              className="h-auto w-full object-contain"
            />
          </figure>
          <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
            <Image
              src="/images/area/West Approach Road from above.png"
              alt="West Approach Road from above"
              width={1200}
              height={800}
              sizes="(min-width:1024px) 800px, 100vw"
              className="h-auto w-full object-contain"
            />
          </figure>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">The context for James Square</h3>
        <p>
          By the late 1970s and early 1980s, Dalry presented a clear contrast. It remained close to the
          city centre and well served by transport, yet bore the physical legacy of industrial decline
          and large-scale infrastructure projects. Former railway and service land near Caledonian
          Crescent became increasingly attractive for private residential redevelopment as demand for
          city-centre living returned.
        </p>
        <p>It was within this setting that James Square was conceived.</p>
        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
          <Image
            src="/images/area/James-Square-Outside-1980s.PNG"
            alt="James Square exterior in the 1980s"
            width={1200}
            height={800}
            sizes="(min-width:1024px) 800px, 100vw"
            className="h-auto w-full object-contain"
          />
        </figure>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">James Square: development and design</h3>
        <p>
          James Square, located on Caledonian Crescent, was constructed in the mid-1980s as a private
          residential development. It was designed from the outset for private ownership and was not a
          council or housing association project. Unusually for its time, the development incorporated
          shared amenities such as a private swimming pool, gym, and sauna, reflecting a shift toward
          amenity-led urban living.
        </p>
        <figure className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl jqs-glass shadow-md bg-white/40 dark:bg-white/10">
          <Image
            src="/images/area/James-Square-old.png"
            alt="James Square in the mid-1980s"
            width={1200}
            height={800}
            sizes="(min-width:1024px) 800px, 100vw"
            className="h-auto w-full object-contain"
          />
        </figure>
        <p>
          The inward-facing courtyard layout responded directly to its surroundings, turning away
          from the West Approach Road and adjacent infrastructure in favour of a contained communal
          space. Public records do not definitively identify the developer or architect, nor do they
          clearly establish whether the site replaced specific buildings or previously cleared land.
          This lack of detailed archival record is typical of many private developments from the 1980s.
        </p>
        <p>
          James Square exists as a direct consequence of earlier changes to the area. The decline of
          the railways, the clearance of industrial land, and the construction of the West Approach
          Road created the conditions that made this form of redevelopment both possible and desirable.
          Today, James Square sits quietly within a neighbourhood shaped by more than a century of
          layered urban change.
        </p>
      </div>
    </div>
  );
}
