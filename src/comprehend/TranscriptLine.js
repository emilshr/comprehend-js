// copied from https://github.com/aws-samples/medical-transcription-analysis/
// and modified to current application.
import React, { useMemo } from 'react';
import s from './TranscriptLine.module.css';
import cs from 'clsx';

import classMap from './transcriptHighlights';


// Reduces results down to a single set of non-overlapping ranges, each with a list of applicable results
function combineSegments(results) {
  const markers = [];

  const addMarker = where => {
    if (!markers.includes(where)) markers.push(where);
  }

  results.forEach(r => {
    addMarker(r.BeginOffset);
    addMarker(r.EndOffset);

    (r.Attributes || []).forEach(a => {
      addMarker(a.BeginOffset);
      addMarker(a.EndOffset);
    });
  });

  markers.sort((a, b) => a - b);

  let ret = [];

  for (let i = 0; i < markers.length - 1; i++) {
    const start = markers[i];
    const end = markers[i + 1];

    const matches = results.filter(r =>
      (r.BeginOffset <= start && r.EndOffset >= end) ||
      (r.Attributes || []).some(a => (
        (a.BeginOffset <= start && a.EndOffset >= end)
      ))
    );

    if (matches.length) ret.push({ start, end, matches })
  }

  console.log({ret})

  return ret;
}


// Takes text and a list of segments and returns an array of { text, matches } segments,
// with applicable text and array of matching results for that segment
function applySegmentsToWords(text, segments) {
  const ranges = [];

  let last = 0;

  segments.forEach(({ start, end, matches }) => {
    if (start > last) {
      ranges.push({
        text: text.slice(last, start),
        matches: []
      });
    }

    ranges.push({
      text: text.slice(start, end),
      matches
    });

    last = end;
  });

  if (last < text.length) {
    ranges.push({
      text: text.slice(last),
      matches: []
    });
  }

  return ranges;
}


const enabledCategories = [
  'PERSON',
  'ORGANIZATION',
  'DATE',
  'QUANTITY',
  'LOCATION'
]

export function TranscriptLine({
  // The specific transcript chunk for this line
  chunk,

  // Comprehend results filtered to just this line
  results
}) {
  const filteredResults = useMemo(() => results.filter(r => enabledCategories.includes(r.Type)), [results, enabledCategories])
  const sortedResults = useMemo(() => filteredResults.sort((a, b) => a.BeginOffset - b.BeginOffset), [filteredResults]);
  const splitSegments = useMemo(() => combineSegments(sortedResults), [sortedResults]);
  const ranges = useMemo(() => applySegmentsToWords(chunk, splitSegments), [chunk, splitSegments]);

  console.log({ ranges })

  return (
    <p className={s.base}>
      {ranges.map((r, i) => (
        <span key={i} className={cs(r.matches.map(x => classMap[x.Type]))}>
          {r.text}
        </span>
      ))}
    </p>
  )
}

export function TranscriptHTML({ textChunks, comprehendResults }) {

  return (
    <div className={s.textareadiv}>
      {(textChunks || []).map((x, i) => (
        <TranscriptLine key={i} chunk={x} results={comprehendResults[i]} />
      ))}
    </div>
  )
}
