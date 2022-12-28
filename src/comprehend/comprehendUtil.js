import detectEntities from './detectEntities';

export default function runComprehend(text, clientCredentials) {
    return detectEntities(text, clientCredentials)
}