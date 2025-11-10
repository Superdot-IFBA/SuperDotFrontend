import { useState, useEffect, useRef } from "react";
import * as Icon from "@phosphor-icons/react";
import { Flex, Text, Box, } from "@radix-ui/themes";
import { SampleSummary, paginateAllSamples } from "../../api/sample.api";
import { PAGE_SIZE } from "../../api/researchers.api";
import { Button } from "../Button/Button";
import { get } from "lodash";


interface SampleResearcherSearchProps {
  onSelect: (sample: { researcherName: string; sampleId: string; sampleName: string } | null) => void;
}


export function SampleResearcherSearch({ onSelect }: SampleResearcherSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSamples, setFilteredSamples] = useState<SampleSummary[]>([]);
  const [selectedSample, setSelectedSample] = useState<SampleSummary | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [allSamples, setAllSamples] = useState<SampleSummary[]>([]);

  const getFirstAndLastName = (fullName: string) => {
    if (typeof fullName !== 'string') {
      return '';
    }
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0]} ${names[names.length - 1]}`;
    } else {
      return fullName;
    }
  };

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await paginateAllSamples(1, PAGE_SIZE, "");
        if (response.status === 200) {
          setAllSamples(response.data.data);
          setFilteredSamples(response.data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar amostras:", error);
      }
    };

    if (showDropdown) {
      fetchSamples();
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (sample: SampleSummary) => {
    setSelectedSample(sample);
    setShowDropdown(false);
    onSelect({
      researcherName: sample.researcherName,
      sampleId: sample.sampleId,
      sampleName: sample.sampleName,
    });
  };
  const handleInputChange = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredSamples(allSamples);
    } else {
      const filtered = allSamples.filter(
        (sample) =>
          sample.researcherName.toLowerCase().includes(value.toLowerCase()) ||
          sample.sampleName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSamples(filtered);
    }

    setShowDropdown(true);
  };


  return (
    <Flex align={"center"} className="w-full max-sm:flex-col " gap={"4"}>
      <div className="mr-4 text-gray-700 font-medium text-xl justify-center">
        {selectedSample
          ? `Amostra em análise: ${selectedSample.sampleName}`
          : "Analise de todas Amostras"}
      </div>
      <div className="relative ml-auto w-[600px] max-sm:w-full z-40" ref={searchRef} >
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar pesquisador ou amostra"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        <Icon.MagnifyingGlass size={16} className="absolute top-3 left-2 text-gray-400" />

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSamples.length > 0 ? (
              filteredSamples.map((sample) => (
                <div
                  key={sample.sampleId}
                  className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelect(sample)}
                >
                  <Flex justify="between" align="center">
                    <Text size="2" weight="medium">{getFirstAndLastName(sample.researcherName)}</Text>
                    <Text size="1" color="gray">{sample.sampleName}</Text>
                  </Flex>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500">Nenhuma amostra encontrada</div>
            )}
          </div>
        )}


        {selectedSample && (
          <Box className="p-3 bg-purple-100 border border-gray-200 rounded-lg mt-2 relative">
            <Flex align="center" gap="3">
              <Icon.User size={20} className="text-primary" />
              <Flex direction="column">
                <Text size="2" weight="medium" className="text-gray-800">{getFirstAndLastName(selectedSample.researcherName)}</Text>
                <Text size="1" className="text-gray-600">{selectedSample.sampleName}</Text>
              </Flex>

              <Button
                color="red"
                size="Extra Small"
                onClick={() => {
                  setSelectedSample(null);
                  onSelect(null);
                }}
                className="ml-auto rounded absolute right-1 top-1"
                aria-label="Remover seleção" title={""}
              >
                <Icon.X size={12} />
              </Button>
            </Flex>
          </Box>
        )}


      </div>
    </Flex>
  );
}
