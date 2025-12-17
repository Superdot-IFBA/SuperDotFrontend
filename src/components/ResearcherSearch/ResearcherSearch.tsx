import { useState, useEffect, useRef } from "react";
import * as Icon from "@phosphor-icons/react";
import { Flex, Text, Box, ScrollArea } from "@radix-ui/themes";
import { SampleSummary, paginateAllSamples } from "../../api/sample.api";
import { PAGE_SIZE } from "../../api/researchers.api";
import { Button } from "../Button/Button";
import TruncatedText from "../TruncatedText/TruncatedText";

interface SampleResearcherSearchProps {
  onSelect: (sample: { researcherName: string; sampleId: string; sampleName: string } | null) => void;
}

export function SampleResearcherSearch({ onSelect }: SampleResearcherSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSamples, setFilteredSamples] = useState<SampleSummary[]>([]);
  const [selectedSample, setSelectedSample] = useState<SampleSummary | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        const response = await paginateAllSamples(1, PAGE_SIZE, "");
        if (response.status === 200) {
          setAllSamples(response.data.data);
          setFilteredSamples(response.data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar amostras:", error);
      } finally {
        setIsLoading(false);
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
    setSearchTerm("");
    onSelect({
      researcherName: sample.researcherName,
      sampleId: sample.sampleId,
      sampleName: sample.sampleName,
    });
  };

  const handleClearSelection = () => {
    setSelectedSample(null);
    setSearchTerm("");
    onSelect(null);
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
    <Flex align="center" className="w-full max-sm:flex-col max-md:flex-col" gap="4">
      <div className="mr-4 text-gray-800 font-semibold text-xl justify-center max-sm:text-center max-sm:mr-0 max-sm:mb-2">
        {selectedSample
          ? <Flex align="center" gap="2">
            <Icon.Flask size={30} weight="duotone" className="text-primary" />
            <span>Amostra em análise: {selectedSample.sampleName}</span>
          </Flex>
          : <Flex align="center" gap="2">
            <Icon.ChartBar size={30} weight="duotone" className="text-primary" />
            <span>Análise de todas as amostras</span>
          </Flex>
        }
      </div>

      <div className="relative ml-auto w-[600px] max-sm:w-full max-md:w-full z-20" ref={searchRef}>
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-xl p-3 pl-12 pr-10  transition-all duration-200 bg-white shadow-sm  text-gray-800 placeholder-gray-400"
            placeholder="Buscar pesquisador ou amostra..."
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />

          <Icon.MagnifyingGlass
            size={20}
            className="absolute top-3.5 left-4 text-gray-400"
            weight="duotone"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Icon.X size={16} />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute z-20 w-full mt-2 bg-white  border-gray-100 rounded-xl shadow-xl max-h-80 overflow-y-scroll backdrop-blur-sm" style={{
            scrollbarWidth: 'thin',

          }}>
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500 mx-auto"></div>
                <Text size="2" className="text-gray-500 mt-2">Carregando amostras...</Text>
              </div>
            ) : filteredSamples.length > 0 ? (
              filteredSamples.map((sample, index) => (

                <div
                  key={sample.sampleId}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-violet-50 border-b border-gray-50 last:border-b-0 ${index === 0 ? 'rounded-t-xl' : ''
                    } ${index === filteredSamples.length - 1 ? 'rounded-b-xl' : ''}`}
                  onClick={() => handleSelect(sample)}
                >
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-primary rounded-full flex items-center justify-center">
                        <Icon.User size={16} className="text-white" />
                      </div>
                      <Flex direction="column">
                        <Text size="2" className="text-gray-800 font-semibold">
                          {getFirstAndLastName(sample.researcherName)}
                        </Text>
                        <Text size="1" className="text-gray-500">
                          <TruncatedText text={sample.sampleName} maxLength={20} />
                        </Text>
                      </Flex>
                    </Flex>
                    <Icon.CaretRight size={16} className="text-gray-400" />
                  </Flex>
                </div>

              ))
            ) : (
              <div className="p-6 text-center">
                <Icon.MagnifyingGlass size={32} className="text-gray-300 mx-auto mb-2" />
                <Text size="2" className="text-gray-500">Nenhuma amostra encontrada</Text>
                <Text size="1" className="text-gray-400 mt-1">Tente alterar os termos da busca</Text>
              </div>
            )}
          </div>
        )}

        {selectedSample && (
          <Box className="p-4 bg-gradient-to-r from-violet-50 to-violet-100 border-2 border-violet-300 rounded-xl mt-3 relative shadow-sm">
            <Flex align="center" gap="4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-primary rounded-full flex items-center justify-center shadow-sm">
                <Icon.User size={20} className="text-white" weight="duotone" />
              </div>

              <Flex direction="column" className="flex-1">
                <Text size="2" weight="bold" className="text-gray-800">
                  {getFirstAndLastName(selectedSample.researcherName)}
                </Text>
                <Text size="1" className="text-gray-600">
                  {selectedSample.sampleName}
                </Text>
              </Flex>

              <Button
                color="red"
                size="Extra Small"
                onClick={handleClearSelection}
                className="rounded-full p-2 hover:scale-105 transition-transform duration-200 shadow-sm absolute top-2 right-2"
                aria-label="Remover seleção"
                title=""
              >
                <Icon.X size={14} weight="bold" />
              </Button>
            </Flex>


          </Box>
        )}
      </div>
    </Flex>
  );
}