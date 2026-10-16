/**
 * Published committee meeting minutes. Kept in code rather than the meetings
 * database so the full structure (headings, lists, actions) is preserved.
 */
export type MinutesBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "action"; text: string };
export type MinutesSection = {
  title: string;
  blocks: MinutesBlock[];
};
export type Minutes = {
  meetingId: string;
  date: string;
  time: string;
  location: string;
  present: string[];
  /** "draft" until the committee approves them at a later meeting. */
  status: "draft" | "approved";
  /** Shown before the full minutes are expanded. */
  keyPoints: string[];
  sections: MinutesSection[];
  closing: string;
};

const p = (text: string): MinutesBlock => ({ type: "p", text });
const h = (text: string): MinutesBlock => ({ type: "h", text });
const list = (items: string[]): MinutesBlock => ({ type: "list", items });
const action = (text: string): MinutesBlock => ({ type: "action", text });

export const MINUTES: Minutes[] = [
  {
    meetingId: "october-2026",
    date: "2026-10-12",
    time: "18:15–20:05",
    location: "James Square, Block 61 and Microsoft Teams",
    present: [
      "Mariana",
      "James",
      "Kareen",
      "Erica",
      "Derek (via Microsoft Teams)",
    ],
    status: "approved",
    keyPoints: [
      "Swimming pool: draining is being planned to reduce running costs, and quotations for repairs and improvements are being sought. No design or spending has been approved; options and costs will be put to owners first.",
      "A Swimming Pool Focus Group is proposed, and interested owners are invited to get involved.",
      "The gardens have had a three-day seasonal maintenance visit, and cleaning gaps found during an inspection have been passed to the cleaning team.",
      "Volunteers are wanted: new Committee members and a helper for communications, the website and social media.",
    ],
    closing: "The meeting concluded at approximately 20:05.",
    sections: [
      {
        title: "Welcome, Previous Meeting and Owner Engagement",
        blocks: [
          p(
            "The meeting commenced with a review of the previous Committee meeting and outstanding matters. No objections were raised regarding the previous minutes, although several ongoing actions remain under discussion with Myreside Management.",
          ),
          p(
            "The Committee discussed the importance of improving communication with property owners and encouraging greater involvement in matters affecting James Square.",
          ),
          p(
            "Although the October meeting had been advertised on the website, no additional owners attended in person or online. It was acknowledged that the relatively short notice may have contributed to this.",
          ),
          p(
            "Going forward, the Committee intends to advertise meetings further in advance, with future meeting dates published on the James Square website.",
          ),
          p(
            "Owners are welcome to attend Committee meetings to listen and, when invited, raise relevant matters and contribute to discussions. Owners wishing to participate fully in Committee business and decision-making are encouraged to become Committee members.",
          ),
          p(
            "Additional Committee members would be very welcome, particularly as significant projects, including the swimming pool refurbishment, are likely to require considerable time and coordination over the coming months.",
          ),
          p(
            "The Committee also discussed the benefit of recruiting a volunteer specifically to assist with communications, website updates and social media. This would help ensure that important information is shared consistently across the website, Facebook, WhatsApp and other appropriate channels.",
          ),
        ],
      },
      {
        title: "Caretaker Duties and Responsibilities",
        blocks: [
          p(
            "The Committee reviewed the current caretaker arrangements and discussed the importance of clearly defined responsibilities to ensure that owners and residents receive an effective and accessible service.",
          ),
          p(
            "It was noted that the caretaker is employed by Myreside Management and that any employment-related matters remain the responsibility of Myreside rather than the Owners’ Committee. Such matters will continue to be addressed through the appropriate channels.",
          ),
          p(
            "The caretaker has been invited to attend the next Committee meeting and has also made arrangements to meet with Committee members to discuss operational matters, highlight any issues or concerns, and explore opportunities to improve the services provided at James Square.",
          ),
        ],
      },
      {
        title: "Cleaning Arrangements",
        blocks: [
          p(
            "The Committee reviewed recent concerns regarding communal cleaning standards and discussed the outcome of a site inspection carried out by Mariana alongside the cleaning team leader.",
          ),
          p(
            "During the inspection, several areas requiring additional attention were identified. The general standard of cleaning was considered reasonable, although improvements remain necessary to ensure a consistently good standard throughout the development.",
          ),
          p(
            "It was clarified that communal residential blocks are generally scheduled for cleaning approximately once per week, while the reception and swimming pool areas receive more frequent attention.",
          ),
          p(
            "Although the swimming pool is currently closed, its associated toilets remain available for occasional use by staff and contractors. The need to maintain appropriate cleaning arrangements for these facilities was highlighted and has since been addressed with the cleaning team.",
          ),
          p(
            "Particular attention was also drawn to the corridor connecting the swimming pool area with the adjoining residential accommodation, which had previously been overlooked. Following the inspection, this was identified to the cleaning team for inclusion in their cleaning arrangements.",
          ),
          p(
            "The Committee discussed the time cleaners spend on site. It was explained that James Square is charged for time spent undertaking cleaning work rather than a fixed daily attendance period. Consequently, the length of each visit may vary depending on the work required.",
          ),
          p(
            "The Committee considers the quality and completion of cleaning tasks more important than requiring cleaners to remain on site for a predetermined period when no additional work is necessary.",
          ),
          p(
            "Owners and residents are encouraged to report recurring cleaning problems, ideally with photographs showing the affected area, so that specific locations can be identified and addressed.",
          ),
          action(
            "The Committee will continue monitoring cleaning standards and forwarding identified concerns to the cleaning team and Myreside Management where appropriate.",
          ),
        ],
      },
      {
        title: "Gardening and Grounds Maintenance",
        blocks: [
          p(
            "The Committee discussed the standard of gardening and grounds maintenance following concerns that the service had not been meeting the standard previously provided.",
          ),
          p(
            "These concerns were raised directly with Myreside Management, with particular emphasis on preserving James Square’s distinctive landscaped gardens.",
          ),
          p(
            "The Committee highlighted that the gardens are a valuable feature of the development and require knowledgeable and attentive maintenance rather than basic grounds upkeep.",
          ),
          p(
            "Following these discussions, a gardening team attended James Square for approximately three full days, carrying out substantial seasonal maintenance, pruning and general tidying.",
          ),
          p(
            "The extent of the cutting back initially caused some concern, as the gardens appeared considerably reduced in places. However, discussions with the gardening team provided reassurance that the work was intended to prepare the planting for winter and encourage healthier growth in spring.",
          ),
          p(
            "The Committee acknowledged that the gardens are now noticeably tidier. Certain plants had previously become overgrown, limiting light and affecting neighbouring planting, and it is hoped that the work will improve conditions for future growth.",
          ),
          p(
            "Further seasonal maintenance, including attention to trees, is anticipated as required. Routine gardening visits are expected to become less frequent during the winter months before increasing again during the growing season.",
          ),
          action(
            "The Committee will review the condition of the gardens in spring 2027 and continue working with Myreside to ensure that the quality of maintenance meets expectations.",
          ),
        ],
      },
      {
        title: "Swimming Pool and Leisure Facilities",
        blocks: [
          p(
            "The swimming pool remains one of the most significant matters facing James Square. The Committee held a detailed discussion about the current closure, ongoing operating costs, essential repairs and potential long-term refurbishment.",
          ),
          h("Current closure and preparation for works"),
          p(
            "The Committee discussed the recommendation to drain the swimming pool in preparation for the necessary works.",
          ),
          p(
            "Although the pool remains closed, maintaining it in its current condition continues to incur costs relating to electricity, water treatment, humidity control and associated equipment.",
          ),
          p(
            "Draining the pool should help reduce some of these ongoing costs. However, the process requires appropriate planning to ensure that pumps, pipework and other equipment are protected during an extended period out of use.",
          ),
          p(
            "Myreside has been investigating the practical arrangements for draining and preparing the pool, including obtaining specialist quotations and considering any necessary regulatory requirements.",
          ),
          p(
            "The Committee supports progressing this work in a controlled manner to minimise unnecessary expenditure while protecting the facilities.",
          ),
          h("Essential repairs and refurbishment options"),
          p(
            "The Committee discussed the distinction between works required to address existing safety concerns and additional refurbishment that owners may wish to undertake.",
          ),
          p(
            "Essential works include matters identified through assessments of the pool and surrounding facilities, including the ceiling and recommendations relating to pool safety.",
          ),
          p(
            "It was acknowledged that there will be significant costs associated with returning the facility to use, regardless of whether owners decide to proceed with a more extensive refurbishment.",
          ),
          p(
            "Myreside has been contacting contractors and obtaining quotations for both essential works and possible improvements.",
          ),
          p(
            "However, obtaining multiple comparable quotations has proved difficult, with some contractors unable to attend or respond within the desired timescales.",
          ),
          p(
            "The Committee agreed that obtaining alternative quotations is important to allow owners to make informed decisions and ensure value for money.",
          ),
          p(
            "A further meeting is being pursued with representatives from Lothian House, where a similar leisure facility refurbishment has taken place. The intention is to learn from their experience, including the contractors used, the work undertaken and the financial and practical challenges encountered.",
          ),
          h("Long-term vision"),
          p(
            "The Committee discussed the opportunity to consider a wider refurbishment of the leisure facilities rather than simply restoring the existing layout.",
          ),
          p("Ideas included:"),
          list([
            "A smaller leisure-style swimming pool.",
            "Potential spa or jacuzzi facilities.",
            "Revised sauna and steam room arrangements.",
            "Improved showers and changing facilities.",
            "A better-designed gym area.",
          ]),
          p(
            "Particular attention was drawn to the current gym environment, where temperature and humidity can make exercise uncomfortable and contribute to deterioration of equipment.",
          ),
          p(
            "A more suitably enclosed and ventilated gym area was discussed as one potential improvement.",
          ),
          p(
            "These were preliminary ideas only. No final design, specification or expenditure was approved at the meeting.",
          ),
          p(
            "The Committee recognises that owners will have differing preferences and that the future of the leisure area should be considered collectively.",
          ),
          p(
            "Suitable options, together with estimated costs, will need to be presented to owners before any significant decisions are made.",
          ),
          h("Proposed Swimming Pool Focus Group"),
          p(
            "A proposal was discussed to establish a dedicated Swimming Pool Focus Group, allowing interested owners to contribute specifically to the leisure facilities project without needing to participate in all other Committee matters.",
          ),
          p(
            "Erica indicated that she would be willing to help lead this group once her existing commitments allow, potentially from December.",
          ),
          p(
            "The group would help gather ideas from owners, identify suitable contractors, explore design proposals and assist with communication as the project develops.",
          ),
          p(
            "It was suggested that the group could meet periodically, report its progress to the Committee and provide updates to owners through the James Square website.",
          ),
          p(
            "James also offered to assist with visual concepts, digital renderings and presentations to help owners better understand the different options being considered.",
          ),
          p(
            "The Committee welcomed this approach and intends to invite interested owners to become involved.",
          ),
          h("Funding and owner decisions"),
          p(
            "The Committee acknowledged that any substantial refurbishment will require financial contributions and approval through the appropriate owners’ decision-making process.",
          ),
          p(
            "There was discussion about whether potential savings from reduced pool operating costs could assist with future works. However, any actual savings will need to be confirmed through the annual factoring accounts.",
          ),
          p(
            "Once suitable proposals and quotations have been obtained, a wider owners’ meeting is anticipated to consider the available options, costs and necessary decisions.",
          ),
          action(
            "Progress pool drainage preparations, obtain additional quotations, pursue discussions with Lothian House, invite interest in the proposed focus group and continue providing updates to owners.",
          ),
        ],
      },
      {
        title: "Current Maintenance Plans",
        blocks: [
          p(
            "The Committee reviewed the need for a more structured approach to identifying, recording and managing maintenance work throughout James Square.",
          ),
          p(
            "During recent inspections, several issues were identified, including communal light fittings which may require replacement despite the bulbs themselves remaining operational.",
          ),
          p(
            "The Committee expressed concern that minor maintenance issues can remain outstanding when they are not identified early or recorded centrally.",
          ),
          p(
            "Myreside has been asked to clarify how routine and non-routine maintenance tasks are managed and how outstanding items can be recorded and monitored through its management systems.",
          ),
          p(
            "The Committee would like to see a clear maintenance record identifying reported defects, their priority, the action required and progress made towards completion.",
          ),
          p(
            "This would improve transparency and make it easier to distinguish between immediate repairs, routine maintenance and longer-term projects requiring financial planning.",
          ),
          p(
            "Working at height was also discussed, given the high ceilings, communal stairwells and elevated fittings throughout the development.",
          ),
          p(
            "The Committee recognises that appropriate equipment and qualified contractors may be necessary for certain tasks, but considers it important that these requirements do not prevent routine maintenance from progressing.",
          ),
          action(
            "Continue discussions with Myreside regarding a visible maintenance schedule, outstanding repairs and suitable arrangements for work at height.",
          ),
        ],
      },
      {
        title: "Property Factoring and Myreside Management",
        blocks: [
          p(
            "The Committee discussed current factoring arrangements and the overall performance of Myreside Management since taking over the development in February 2026.",
          ),
          p(
            "Myreside has explained that monthly contributions are allocated against individual owners’ accounts, with charges reconciled against actual expenditure.",
          ),
          p(
            "The Committee acknowledged that major projects, including swimming pool repairs and other significant maintenance works, may require separate funding arrangements.",
          ),
          h("Overall assessment of Myreside"),
          p(
            "The Committee discussed both the improvements achieved by Myreside and areas where further progress is required.",
          ),
          p(
            "It was acknowledged that Myreside inherited a development with numerous outstanding maintenance and financial issues, many of which originated under previous factors.",
          ),
          p(
            "The swimming pool closure and various water leaks have also added to the complexity of managing the site.",
          ),
          p(
            "The Committee recognised the significant progress made in investigating and resolving water leaks, including several longstanding problems which had proved difficult to identify.",
          ),
          p(
            "Positive feedback has been received from owners who have expressed their appreciation for the assistance provided by Myreside in resolving these matters.",
          ),
          p(
            "The Committee also recognised the work undertaken by Ania Jennings, including site visits, contractor coordination and efforts to address inherited problems.",
          ),
          p(
            "While delays and communication difficulties remain in some areas, members generally considered Myreside to represent an improvement on previous factoring arrangements.",
          ),
          p(
            "The Committee’s intention is to continue working constructively with Myreside while maintaining scrutiny of costs, service standards and progress on outstanding matters.",
          ),
          p(
            "Owners with questions about their individual factoring accounts should contact Myreside directly.",
          ),
        ],
      },
      {
        title: "Any Other Business",
        blocks: [
          h("FIOR Property Assets"),
          p(
            "A brief update was provided regarding the former factor, FIOR Property Assets, and outstanding matters following the change of factoring arrangements.",
          ),
          p(
            "The Committee confirmed that a dedicated information page has been published on the James Square website, bringing together background information and guidance to assist affected owners.",
          ),
          p(
            "Individual owners who believe they are owed money by FIOR are encouraged to review the information available and consider the options appropriate to their circumstances.",
          ),
          p(
            "Further information is available at: https://www.james-square.com/fior-info",
          ),
          h("Fire safety and emergency arrangements"),
          p(
            "The Committee discussed outstanding matters relating to the communal fire alarm system and the need for clearer emergency guidance.",
          ),
          p(
            "The Committee wishes to obtain authoritative confirmation of the applicable fire safety arrangements and clear written guidance for owners, residents, tenants and visitors.",
          ),
          p(
            "Further contact will be made with the relevant fire safety professionals and, where appropriate, the Scottish Fire and Rescue Service to clarify these matters.",
          ),
          p(
            "Until formal guidance has been confirmed, the Committee does not intend to issue new or amended evacuation instructions based solely on the meeting discussion.",
          ),
          p(
            "Any confirmed updates affecting residents will be communicated through the appropriate channels.",
          ),
          h("CCTV arrangements"),
          p("The current CCTV arrangements were briefly discussed."),
          p(
            "The Committee emphasised that CCTV should be operated appropriately, with due regard to privacy, access controls and data protection responsibilities.",
          ),
          p(
            "It was suggested that a fuller review of CCTV arrangements would be worthwhile at a future Committee meeting.",
          ),
          h("Communal damp and mould"),
          p(
            "A concern was raised regarding damp and mould appearing in the lower-ground-floor stairwell of Block 45, following an earlier report of an unusual smell.",
          ),
          p(
            "Photographs of the affected area had already been forwarded to Myreside Management. Although the smell had subsequently disappeared, visible mould remained.",
          ),
          p(
            "The Committee discussed the importance of investigating the underlying cause rather than relying solely on surface cleaning, particularly given the development’s history of water ingress.",
          ),
          action(
            "Follow up with Myreside regarding investigation and treatment of the affected area.",
          ),
          h("Committee volunteers and communications"),
          p(
            "The Committee reiterated its wish to encourage additional participation, including volunteers interested in helping with the proposed Swimming Pool Focus Group and a dedicated communications or social media role.",
          ),
          p(
            "A volunteer communications role could assist with maintaining the website, keeping information consistent across community channels and improving the accessibility of Committee updates.",
          ),
          p(
            "Effective communication will become increasingly important as owners are asked to consider proposals and decisions relating to the swimming pool.",
          ),
        ],
      },
      {
        title: "Next Meetings",
        blocks: [
          p(
            "The Committee agreed that future meeting dates should be published further in advance wherever possible.",
          ),
          p("Next Committee meeting: Tuesday 17 November 2026 at 18:15."),
          p("Further provisional meeting: Tuesday 8 December 2026."),
          p(
            "The Committee intends to continue publishing dates in advance to give owners more opportunity to attend and participate.",
          ),
          p(
            "Meeting details and updates will be available at: https://www.james-square.com/committee-meeting",
          ),
        ],
      },
    ],
  },
];

/** Most recent minutes first. */
export function publishedMinutes() {
  return [...MINUTES].sort((a, b) => b.date.localeCompare(a.date));
}
export function minutesFor(meetingId: string) {
  return MINUTES.find((m) => m.meetingId === meetingId);
}
/** Every "Ongoing action" recorded in the minutes, with the section it came from. */
export function minutesActions(minutes: Minutes) {
  return minutes.sections.flatMap((s) =>
    s.blocks.flatMap((b) =>
      b.type === "action" ? [{ section: s.title, text: b.text }] : [],
    ),
  );
}
